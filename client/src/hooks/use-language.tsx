
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'hindi' | 'spanish' | 'french' | 'chinese';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  english: {
    welcome: 'Welcome to VidyaVerse',
    notes: 'Notes',
    doubts: 'Doubts',
    events: 'Events',
    home: 'Home',
    classes: 'Classes',
    assignments: 'Assignments',
    schedule: 'Schedule',
    faculty: 'Faculty',
    settings: 'Settings',
    calendar: 'Calendar',
    notifications: 'Notifications',
    profile: 'Profile',
    logout: 'Logout',
    signin: 'Sign In',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    role: 'Role',
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    language_changed_to: 'Language changed to',
    quick_access: 'Quick Access Test Accounts',
    connect_learn_grow: 'Connect, Learn, and Grow Together',
    // Add more translations as needed
  },
  hindi: {
    welcome: 'क्लासोल में आपका स्वागत है',
    notes: 'नोट्स',
    doubts: 'संदेह',
    events: 'कार्यक्रम',
    home: 'होम',
    classes: 'कक्षाएं',
    assignments: 'असाइनमेंट',
    schedule: 'अनुसूची',
    faculty: 'संकाय',
    settings: 'सेटिंग्स',
    calendar: 'कैलेंडर',
    notifications: 'सूचनाएं',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    signin: 'साइन इन करें',
    signup: 'साइन अप करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    role: 'भूमिका',
    student: 'छात्र',
    teacher: 'शिक्षक',
    admin: 'प्रशासक',
    submit: 'सबमिट करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    search: 'खोज',
    language_changed_to: 'भाषा बदल गई है',
    quick_access: 'त्वरित पहुंच परीक्षण खाते',
    connect_learn_grow: 'जुड़ें, सीखें और एक साथ बढ़ें',
    // Add more translations as needed
  },
  spanish: {
    welcome: 'Bienvenido a VidyaVerse',
    notes: 'Notas',
    doubts: 'Dudas',
    events: 'Eventos',
    home: 'Inicio',
    classes: 'Clases',
    assignments: 'Tareas',
    schedule: 'Horario',
    faculty: 'Facultad',
    settings: 'Configuración',
    calendar: 'Calendario',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    signin: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    role: 'Rol',
    student: 'Estudiante',
    teacher: 'Profesor',
    admin: 'Administrador',
    submit: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    language_changed_to: 'Idioma cambiado a',
    quick_access: 'Cuentas de prueba de acceso rápido',
    connect_learn_grow: 'Conecta, Aprende y Crece Juntos',
    // Add more translations as needed
  },
  french: {
    welcome: 'Bienvenue à VidyaVerse',
    notes: 'Notes',
    doubts: 'Doutes',
    events: 'Événements',
    home: 'Accueil',
    classes: 'Classes',
    assignments: 'Devoirs',
    schedule: 'Programme',
    faculty: 'Faculté',
    settings: 'Paramètres',
    calendar: 'Calendrier',
    notifications: 'Notifications',
    profile: 'Profil',
    logout: 'Déconnexion',
    signin: 'Se connecter',
    signup: "S'inscrire",
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    role: 'Rôle',
    student: 'Étudiant',
    teacher: 'Enseignant',
    admin: 'Administrateur',
    submit: 'Soumettre',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    search: 'Rechercher',
    language_changed_to: 'Langue changée en',
    quick_access: 'Comptes de test à accès rapide',
    connect_learn_grow: 'Connecter, Apprendre et Grandir Ensemble',
    // Add more translations as needed
  },
  chinese: {
    welcome: '欢迎来到 VidyaVerse',
    notes: '笔记',
    doubts: '疑问',
    events: '活动',
    home: '首页',
    classes: '课程',
    assignments: '作业',
    schedule: '日程',
    faculty: '教师',
    settings: '设置',
    calendar: '日历',
    notifications: '通知',
    profile: '个人资料',
    logout: '登出',
    signin: '登录',
    signup: '注册',
    email: '电子邮件',
    password: '密码',
    name: '姓名',
    role: '角色',
    student: '学生',
    teacher: '教师',
    admin: '管理员',
    submit: '提交',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    language_changed_to: '语言已更改为',
    quick_access: '快速访问测试账户',
    connect_learn_grow: '连接, 学习, 共同成长',
    // Add more translations as needed
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('VidyaVerse-language');
    return (savedLanguage as Language) || 'english';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('VidyaVerse-language', language);
  }, [language]);

  const translate = (key: string): string => {
    return translations[language][key] || translations.english[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
