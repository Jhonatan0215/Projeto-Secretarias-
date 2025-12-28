
import React, { useState } from 'react';
import { SinapiItem } from '../types';
import { Camera, Upload, Trash2, MapPin, Calendar } from 'lucide-react';

interface Props {
  items: SinapiItem[];
}

interface PhotoReport {
  id: string;
  itemId: string;
  url: string;
  date: string;
  location: string;
  comment: string;
}

const PhotoReports: React.FC<Props> = ({ items }) => {
  const [reports, setReports] = useState<PhotoReport[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.codigo || '');
  const [comment, setComment] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newReport: PhotoReport = {
          id: Math.random().toString(36).substr(2, 9),
          itemId: selectedItemId,
          url: reader.result as string,
          date: new Date().toLocaleDateString('pt-BR'),
          location: '-15.6010, -56.0974 (Cuiabá, MT)',
          comment: comment
        };
        setReports([newReport, ...reports]);
        setComment('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <Camera className="w-6 h-6 text-green-600" /> NOVO RELATÓRIO FOTOGRÁFICO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Item SINAPI Correspondente</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
              >
                {items.map(item => (
                  <option key={item.codigo} value={item.codigo}>{item.codigo} - {item.descricao.substring(0, 40)}...</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Observações / Comentários</label>
              <textarea 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm h-24"
                placeholder="Descreva o progresso executado..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-green-400 transition-colors cursor-pointer group relative">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
            />
            <Upload className="w-12 h-12 text-gray-300 group-hover:text-green-500 mb-2" />
            <p className="text-sm font-bold text-gray-400 group-hover:text-green-600">CLIQUE OU ARRASTE UMA FOTO</p>
            <p className="text-[10px] text-gray-300 mt-1 uppercase">Máx 5MB • JPEG/PNG</p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col justify-center">
            <h4 className="font-black text-amber-800 text-xs mb-2 uppercase tracking-widest">Requisito Técnico</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              As fotos devem conter georreferenciamento e carimbo de data/hora visíveis para aprovação do fiscal. 
              Certifique-se de capturar o item executado em um ângulo claro.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black text-gray-500 uppercase text-xs tracking-widest">Registros Recentes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Nenhum relatório enviado hoje.</p>
            </div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative">
                <img src={report.url} className="w-full h-48 object-cover" alt="Obra" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {report.itemId}
                    </span>
                    <button 
                      onClick={() => removeReport(report.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-medium italic">"{report.comment}"</p>
                  <div className="flex flex-col gap-1 border-t border-gray-50 pt-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <Calendar className="w-3 h-3" /> {report.date}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <MapPin className="w-3 h-3" /> {report.location}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoReports;
