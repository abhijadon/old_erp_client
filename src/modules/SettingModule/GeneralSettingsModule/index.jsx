import SetingsSection from '../components/SetingsSection';
import GeneralSetting from '../components/GeneralModule';
import useLanguage from '@/locale/useLanguage';
import CompanyLogoSettingsModule from '@/modules/SettingModule/CompanyLogoSettingsModule';
export default function GeneralSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <>
      <div className='flex'>
        <GeneralSetting config={config}>
          <div>
            {config.PANEL_TITLE}
          </div>
        </GeneralSetting>
      </div>
    </>
  );
}
