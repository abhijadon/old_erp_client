import SetingsSection from '../components/SetingsSection';
import GeneralSetting from '../components/GeneralModule';
import MoneyFormSettingForm from './SettingsForm';
import useLanguage from '@/locale/useLanguage';

export default function MoneyFormatSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <GeneralSetting config={config}>
      <SetingsSection
        title={translate('Currency Format')}
        description={translate('Update Currency format')}
      >
        <MoneyFormSettingForm />
      </SetingsSection>
    </GeneralSetting>
  );
}
