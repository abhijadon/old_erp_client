import useLanguage from '@/locale/useLanguage';

import CompanyLogoSettingsModule from '@/modules/SettingModule/CompanyLogoSettingsModule';

export default function AppSettings() {
  const translate = useLanguage();

  const entity = 'Institute';

  const Labels = {
    INS_TITLE: translate('Institute'),
    DATATABLE_TITLE: translate('institute_list'),
    ADD_NEW_ENTITY: translate('add_new_institute'),
    ENTITY_NAME: translate('institute'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    settingsCategory: 'app_settings',
    ...Labels,
  };

  return <CompanyLogoSettingsModule config={configPage} />;
}
