import SetingsSection from '../components/SetingsSection';
import GeneralSetting from '../components/GeneralModule';
import AppSettingForm from './forms/AppSettingForm';

import useLanguage from '@/locale/useLanguage';

export default function CompanyLogoSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <GeneralSetting>
      <SetingsSection
        title={
          <div>{config.DATATABLE_TITLE}</div>
        }
      >
        <AppSettingForm />
      </SetingsSection>
    </GeneralSetting>
  );
}
