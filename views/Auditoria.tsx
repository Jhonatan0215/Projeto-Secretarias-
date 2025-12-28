
import React, { useState, useEffect, useRef } from 'react';
import { SinapiItem, Task } from '../types';
import { FileText, Download, ShieldCheck, MapPin, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  items: SinapiItem[];
  tasks: Task[];
}

interface ObraAuditoria {
  id: string;
  local: string;
  empresa: string;
  contrato: string;
  data: string;
  status: 'REGULAR' | 'EM ANÁLISE';
  coords: { lat: number; lng: number; x: number; y: number }; // x/y para o fallback vetorial
  regiao: string;
  execucao: number;
}

const AuditoriaView: React.FC<Props> = ({ items, tasks }) => {
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>('1');
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  const obras: ObraAuditoria[] = [
    { id: '1', local: 'EMEB Cuiabá', empresa: 'Construtora Pantanal', contrato: '042/2023', data: '12/05/2023', status: 'REGULAR', coords: { lat: -15.5961, lng: -56.0967, x: 45, y: 40 }, regiao: 'Centro-Norte', execucao: 85 },
    { id: '2', local: 'EMEB Pantanal', empresa: 'Engenharia MT', contrato: '015/2023', data: '01/02/2023', status: 'EM ANÁLISE', coords: { lat: -15.6180, lng: -56.0650, x: 60, y: 70 }, regiao: 'Sul', execucao: 42 },
    { id: '3', local: 'EMEB Juvina', empresa: 'Várzea Construções', contrato: '088/2023', data: '20/10/2023', status: 'REGULAR', coords: { lat: -15.5800, lng: -56.1200, x: 25, y: 30 }, regiao: 'Oeste', execucao: 92 },
  ];

  const selectedWork = obras.find(o => o.id === selectedWorkId);

  useEffect(() => {
    const win = window as any;
    
    // Captura falhas de autenticação do Google Maps (InvalidKeyMapError)
    win.gm_authFailure = () => {
      console.warn("Google Maps API Key Error detected. Switching to fallback mode.");
      setApiError(true);
    };

    const initializeMap = () => {
      const google = win.google;
      if (!mapRef.current || !google || apiError) return;

      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -15.6014, lng: -56.0979 },
          zoom: 13,
          styles: [
            { "featureType": "water", "stylers": [{"color": "#e9e9e9"}] },
            { "featureType": "landscape", "stylers": [{"color": "#f5f5f5"}] },
            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{"color": "#7c93a3"}] }
          ],
          disableDefaultUI: true,
          zoomControl: true
        });

        obras.forEach(obra => {
          const marker = new google.maps.Marker({
            position: { lat: obra.coords.lat, lng: obra.coords.lng },
            map,
            title: obra.local,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: obra.status === 'REGULAR' ? '#16a34a' : '#f59e0b',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              scale: selectedWorkId === obra.id ? 10 : 7,
            },
          });

          marker.addListener('click', () => setSelectedWorkId(obra.id));
        });
      } catch (e) {
        setApiError(true);
      }
    };

    if (!win.google && !apiError) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(initializeMap, 500);
      script.onerror = () => setApiError(true);
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [selectedWorkId, apiError]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Monitoramento Georreferenciado</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Acompanhamento em tempo real de todas as frentes de trabalho</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-green-700 transition-all active:scale-95">
            <Download className="w-5 h-5" /> EXPORTAR RELATÓRIO CONSOLIDADO
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Map Container with Fallback */}
          <div className="lg:col-span-2 bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 relative min-h-[550px] shadow-inner">
            {apiError ? (
              /* Fallback UI: Mapa Interativo Vetorial */
              <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-amber-200 shadow-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 uppercase">Modo de Segurança Ativo (API Offline)</span>
                </div>
                
                {/* Visualização de Mapa Simulado */}
                <div className="relative w-full h-full max-w-2xl bg-white/40 rounded-full blur-3xl opacity-50"></div>
                
                <div className="absolute inset-0 pointer-events-none opacity-5">
                   <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
                      {Array.from({length: 144}).map((_, i) => <div key={i} className="border border-gray-900"></div>)}
                   </div>
                </div>

                {/* Marcadores Fallback */}
                <div className="absolute inset-0">
                  {obras.map(obra => (
                    <button
                      key={obra.id}
                      onClick={() => setSelectedWorkId(obra.id)}
                      className="absolute transition-all hover:scale-125 group z-10"
                      style={{ left: `${obra.coords.x}%`, top: `${obra.coords.y}%` }}
                    >
                      <div className={`p-1 rounded-full border-4 border-white shadow-xl transition-all ${selectedWorkId === obra.id ? 'scale-150 z-20' : ''} ${obra.status === 'REGULAR' ? 'bg-green-600' : 'bg-amber-600'}`}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                         <p className="text-[10px] font-black text-gray-800">{obra.local}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                <p className="absolute bottom-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest z-20">
                  Visualização da Malha Escolar - Cuiabá/MT
                </p>
              </div>
            ) : (
              /* Real Google Map */
              <div ref={mapRef} className="w-full h-full" />
            )}
            
            <div className="absolute bottom-6 right-6 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-gray-200 shadow-xl flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase">
                <span className="w-3 h-3 rounded-full bg-green-600"></span> Regular
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase">
                <span className="w-3 h-3 rounded-full bg-amber-600"></span> Em Análise
              </div>
            </div>
          </div>

          {/* Work Detail Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col">
            {selectedWork ? (
              <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                      Região {selectedWork.regiao}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 leading-none pt-2">{selectedWork.local}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedWork.empresa}</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-gray-400 uppercase">Execução Física</span>
                      <span className="text-sm font-black text-gray-900">{selectedWork.execucao}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 transition-all duration-1000" 
                        style={{ width: `${selectedWork.execucao}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-xs font-black text-gray-400 uppercase">Nº Contrato</span>
                      <span className="text-sm font-black text-gray-700">{selectedWork.contrato}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-xs font-black text-gray-400 uppercase">Data Auditoria</span>
                      <span className="text-sm font-black text-gray-700">{selectedWork.data}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-xs font-black text-gray-400 uppercase">Situação</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${selectedWork.status === 'REGULAR' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {selectedWork.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-all">
                  <FileText className="w-5 h-5" /> DETALHAMENTO COMPLETO
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Selecione uma obra no mapa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaView;
