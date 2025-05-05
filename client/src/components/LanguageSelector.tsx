
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();

  const languages = [
    { key: 'english', label: 'English' },
    { key: 'hindi', label: 'हिंदी (Hindi)' },
    { key: 'spanish', label: 'Español (Spanish)' },
    { key: 'french', label: 'Français (French)' },
    { key: 'chinese', label: '中文 (Chinese)' }
  ];

  const handleLanguageChange = (langKey: string) => {
    setLanguage(langKey as any);
    // Show a toast when language is changed
    toast.success(`${translate('language_changed_to')} ${languages.find(lang => lang.key === langKey)?.label}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.key}
            onClick={() => handleLanguageChange(lang.key)}
            className={language === lang.key ? 'bg-scholar-50 text-scholar-700 dark:bg-scholar-900 dark:text-scholar-300 font-medium' : ''}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
