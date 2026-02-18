import { useState } from 'react'
import AdminLayout from './AdminLayout'
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react'

export default function GalleryManagement() {
  const [images, setImages] = useState([
    { id: 1, url: 'https://via.placeholder.com/300', title: 'Événement 1', service: 'Magicien', visible: true },
    { id: 2, url: 'https://via.placeholder.com/300', title: 'Événement 2', service: 'Animateur', visible: true },
    { id: 3, url: 'https://via.placeholder.com/300', title: 'Événement 3', service: 'Clown', visible: false },
  ])

  const toggleVisibility = (id) => {
    setImages(images.map(img => img.id === id ? { ...img, visible: !img.visible } : img))
  }

  const deleteImage = (id) => {
    setImages(images.filter(img => img.id !== id))
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Gestion de la galerie</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload size={18} />
            Ajouter une image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map(image => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative bg-gray-200 h-48 overflow-hidden">
                <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Titre</p>
                  <p className="text-gray-900 font-medium">{image.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Service</p>
                  <p className="text-gray-900">{image.service}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility(image.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      image.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {image.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    {image.visible ? 'Visible' : 'Caché'}
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={18} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
