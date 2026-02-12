import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/AuthProvider';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  Heart, 
  HelpCircle, 
  Home,
  Trash2,
  Save,
  Briefcase,
  MapPin,
  DollarSign,
  Phone,
  Building2,
  Car,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { toast } from 'react-hot-toast';

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile, loading } = useProfile();
  const [activeSection, setActiveSection] = useState('profile');
  const [favorites, setFavorites] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error

  console.log(JSON.stringify(user, null, 2));
  
  const [profileData, setProfileData] = useState({
    firstName: user?.name || '',
    age: user?.datos_personales?.edad || '',
    maritalStatus: user?.datos_personales?.estado_civil || '',
    children: user?.datos_personales?.hijos || 0,
    city: user?.datos_personales?.direccion || '',
    phone: user?.datos_personales?.telefono || '',
    occupation: user?.datos_laborales?.ocupacion || '',
    workplace: user?.datos_laborales?.empresa || '',
    workAddress: user?.datos_laborales?.direccion_laboral || '',
    employmentType: user?.datos_laborales?.tipo_empleo || '',
    monthlyIncome: user?.datos_laborales?.ingresos_mensuales || '',
    workExperience: user?.datos_laborales?.antiguedad_laboral || '',
    preferredZone: user?.preferencias?.zona_preferida || '',
    budget: user?.preferencias?.rango_precio || '',
    minLandSize: user?.preferencias?.superficie_minima || '',
    intendedUse: user?.preferencias?.motivo_compra || '',
    basicServices: user?.preferencias?.servicios_basicos || '',
    email: user?.email || ''
  });



  const menuItems = [
    { id: 'profile', label: 'Mi cuenta', icon: User, color: 'emerald' },
    
    { id: 'favorites', label: 'Favoritos', icon: Heart, color: 'rose' },

  ];

  // Calcular progreso del perfil
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.firstName, profileData.age, profileData.maritalStatus,
      profileData.city, profileData.phone, profileData.occupation,
      profileData.workplace, profileData.monthlyIncome, profileData.budget
    ];
    const completed = fields.filter(field => field && field !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const fetchFavorites = async () => {
    try {
      console.log(user.favorites)
      const lotesPromises = user.favorites.map(async (loteId) => {
        const loteResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/resultados/${loteId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (loteResponse.ok) {
          return loteResponse.json();
        }
        return null;
      });

      const lotesData = await Promise.all(lotesPromises);
      const validLotes = lotesData.filter(lote => lote !== null);
      setFavorites(validLotes);

    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  useEffect(() => {
    if (activeSection === 'favorites') {
      fetchFavorites();
    }
  }, [activeSection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (loading) return;

    setSaveStatus('saving');
    try {
      const profileDataEdit = {
        id: user.id,
        name: `${profileData.firstName}`,
        datos_personales: {
          edad: profileData.age,
          estado_civil: profileData.maritalStatus,
          hijos: parseInt(profileData.children) || 0,
          telefono: profileData.phone,
          direccion: profileData.city,

        },
        datos_laborales: {
          ocupacion: profileData.occupation,
          empresa: profileData.workplace,
          antiguedad_laboral: profileData.workExperience,
          ingresos_mensuales: profileData.monthlyIncome,
          tipo_empleo: profileData.employmentType,
          direccion_laboral: profileData.workAddress
        },
        preferencias: {
          zona_preferida: profileData.preferredZone,
          motivo_compra: profileData.intendedUse,
          servicios_basicos: profileData.basicServices || '',
        }
      };

      await updateProfile(profileDataEdit);
      setSaveStatus('success');
      toast.success('¡Perfil actualizado exitosamente!');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setSaveStatus('error');
      toast.error(error.message || 'Error al actualizar el perfil');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      alert('Cuenta eliminada');
    }
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header mejorado */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar mejorado */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl overflow-hidden">
              {/* Profile Card */}
              <div className="p-6 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border-b border-neutral-700/50">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-100 text-lg">{user?.name || 'Usuario'}</h3>
                    <p className="text-sm text-neutral-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user?.email || 'email@example.com'}
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-300">Perfil completado</span>
                    <span className="text-emerald-400 font-semibold">{profileCompletion}%</span>
                  </div>
                  <div className="h-2 bg-neutral-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                        isActive
                          ? `bg-${item.color}-500/20 text-${item.color}-400 shadow-lg ring-1 ring-${item.color}-500/50`
                          : 'text-neutral-300 hover:bg-neutral-700/50 hover:text-neutral-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                {/* Header con título */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-neutral-100 flex items-center gap-3">
                        <User className="w-8 h-8 text-emerald-400" />
                        Mi Cuenta
                      </h1>
                      <p className="text-neutral-400 mt-1">Gestiona tu información personal y preferencias</p>
                    </div>
                    {saveStatus === 'success' && (
                      <div className="flex items-center gap-2 text-emerald-400 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Guardado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DATOS PERSONALES */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 px-6 py-4 border-b border-neutral-700/50">
                    <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Datos Personales
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400" />
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-neutral-500"
                      />
                    </div>

                    {/* Edad y Estado Civil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">
                          Edad
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={profileData.age}
                          onChange={handleInputChange}
                          min="18"
                          placeholder="35"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">
                          Estado Civil
                        </label>
                        <select
                          name="maritalStatus"
                          value={profileData.maritalStatus}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Soltero">Soltero/a</option>
                          <option value="Casado">Casado/a</option>
                          <option value="Divorciado">Divorciado/a</option>
                          <option value="Viudo">Viudo/a</option>
                        </select>
                      </div>
                    </div>

                    {/* Hijos y Ciudad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">
                          Número de Hijos
                        </label>
                        <input
                          type="number"
                          name="children"
                          value={profileData.children}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="0"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          Ciudad de Residencia
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          placeholder="Ej: Asunción"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        placeholder="+595 9XX 123 4567"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* DATOS LABORALES */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 px-6 py-4 border-b border-neutral-700/50">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Datos Laborales
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-400" />
                          Ocupación
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={profileData.occupation}
                          onChange={handleInputChange}
                          placeholder="Ej: Ingeniero Civil"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="workplace"
                          value={profileData.workplace}
                          onChange={handleInputChange}
                          placeholder="Nombre de la empresa"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          Ingresos Mensuales (Gs.)
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={profileData.monthlyIncome}
                          onChange={handleInputChange}
                          placeholder="5000000"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-400" />
                          Tipo de Empleo
                        </label>
                        <select
                          name="employmentType"
                          value={profileData.employmentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar</option>
                          <option value="presencial">Presencial</option>
                          <option value="virtual">Virtual</option>
                          <option value="mixto">Mixto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Dirección Laboral
                      </label>
                      <input
                        type="text"
                        name="workAddress"
                        value={profileData.workAddress}
                        onChange={handleInputChange}
                        placeholder="Ej: Centro de Asunción"
                        className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* PREFERENCIAS DE TERRENO */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600/20 to-purple-900/20 px-6 py-4 border-b border-neutral-700/50">
                    <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Preferencias de Terreno
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">
                          Servicio basico minimo
                        </label>
                        <select
                          name="BasicService"
                          value={profileData.basicServices}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar</option>
                          <option value="presencial">Eneriga electrica</option>
                          <option value="virtual">Agua</option>
                          <option value="mixto">Internet</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-purple-400" />
                          Presupuesto Cuota (Gs.)
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={profileData.budget}
                          onChange={handleInputChange}
                          placeholder="50000000"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-400" />
                          Tipo de Empleo
                        </label>
                        <select
                          name="employmentType"
                          value={profileData.employmentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar</option>
                          <option value="presencial">Presencial</option>
                          <option value="virtual">Virtual</option>
                          <option value="mixto">Mixto</option>
                        </select>
                      </div> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          Zona Preferida
                        </label>
                        <input
                          type="text"
                          name="preferredZone"
                          value={profileData.preferredZone}
                          onChange={handleInputChange}
                          placeholder="Ej: Zona Sur, Lambaré"
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">
                          Uso Previsto
                        </label>
                        <select
                          name="intendedUse"
                          value={profileData.intendedUse}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 text-neutral-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar</option>
                          <option value="vivienda">Vivienda Principal</option>
                          <option value="inversion">Inversión</option>
                          <option value="negocio">Negocio/Comercial</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-4 rounded-xl hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Guardando...</span>
                        </>
                      ) : saveStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>¡Guardado!</span>
                        </>
                      ) : saveStatus === 'error' ? (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          <span>Error al guardar</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Guardar cambios</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 px-6 py-4 rounded-xl hover:bg-red-900/20 transition-all border border-red-900/50 hover:border-red-800 font-semibold"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Eliminar cuenta</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-700">
                    <p className="text-sm text-neutral-400 text-center flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Los cambios se guardarán de forma segura en tu perfil
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'recent' && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-3">
                    <Clock className="w-7 h-7 text-blue-400" />
                    Vistos Recientemente
                  </h2>
                  <p className="text-neutral-400 mt-1">Tus últimas búsquedas y terrenos visitados</p>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="group flex items-center space-x-4 p-4 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-blue-500/50 transition-all cursor-pointer">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Home className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">Terreno en Asunción Centro</h3>
                        <p className="text-neutral-400 text-sm mt-1">Servicios básicos • Precio accesible • 150m²</p>
                        <p className="text-blue-400 font-bold mt-2 text-lg">Gs. 180.000.000</p>
                      </div>
                      <div className="text-sm text-neutral-500">
                        <p>Hace 2 horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'favorites' && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-3">
                    <Heart className="w-7 h-7 text-rose-400" />
                    Mis Favoritos
                  </h2>
                  <p className="text-neutral-400 mt-1">Terrenos que has guardado como favoritos</p>
                </div>
                
                <div className="space-y-4">
                  {favorites.map((item) => (
                    <div key={item._id} className="group flex items-center space-x-4 p-4 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-rose-500/50 transition-all">
                      <div className="w-32 h-32 bg-neutral-700 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        <img 
                          src={item.galeria_imagenes[0] || ''} 
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-100 text-lg">{item.titulo}</h3>
                        <p className="text-neutral-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {item.ciudad}
                        </p>
                        <p className="text-rose-400 font-bold mt-2 text-xl">Gs. {item.cuota}</p>
                      </div>
                      <button className="text-rose-500 hover:text-rose-400 transition-colors p-3 hover:bg-rose-500/10 rounded-xl">
                        <Heart className="w-6 h-6 fill-current" />
                      </button>
                    </div>
                  ))}
                  {favorites.length === 0 && (
                    <div className="text-center py-16">
                      <Heart className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400 text-lg">No tienes terrenos favoritos guardados</p>
                      <p className="text-neutral-500 text-sm mt-2">Explora y guarda tus terrenos favoritos para verlos aquí</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'help' && (
              <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-100 flex items-center gap-3">
                    <HelpCircle className="w-7 h-7 text-purple-400" />
                    Ayuda y Soporte
                  </h2>
                  <p className="text-neutral-400 mt-1">¿Necesitas ayuda? Estamos aquí para ti</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-6 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-neutral-100 mb-2 text-lg group-hover:text-purple-400 transition-colors">Centro de ayuda</h3>
                    <p className="text-neutral-400 text-sm">Encuentra respuestas a preguntas frecuentes y guías útiles</p>
                  </div>

                  <div className="group p-6 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-emerald-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-neutral-100 mb-2 text-lg group-hover:text-emerald-400 transition-colors">Contactar soporte</h3>
                    <p className="text-neutral-400 text-sm">Habla con nuestro equipo de soporte por email o chat</p>
                  </div>

                  <div className="group p-6 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-red-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-neutral-100 mb-2 text-lg group-hover:text-red-400 transition-colors">Reportar problema</h3>
                    <p className="text-neutral-400 text-sm">Informa sobre errores o problemas técnicos que encuentres</p>
                  </div>

                  <div className="group p-6 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-700/30 hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-neutral-100 mb-2 text-lg group-hover:text-blue-400 transition-colors">Sugerir mejora</h3>
                    <p className="text-neutral-400 text-sm">Comparte tus ideas para mejorar la plataforma</p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/50 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-100 mb-2">¿Necesitas ayuda urgente?</h4>
                      <p className="text-neutral-300 text-sm mb-3">Nuestro equipo está disponible de lunes a viernes de 8:00 a 18:00</p>
                      <div className="flex gap-3">
                        <a href="mailto:soporte@terrenos.com" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors">
                          Enviar Email
                        </a>
                        <a href="tel:+595211234567" className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-semibold transition-colors">
                          Llamar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};