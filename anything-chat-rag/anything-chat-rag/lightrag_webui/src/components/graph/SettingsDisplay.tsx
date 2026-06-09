import { useSettingsStore } from '@/stores/settings'
import { useTranslation } from 'react-i18next'
// eslint-disable  MC8yOmFIVnBZMlhsaUpqbWxvYzZUMWQ0VFE9PTozNjdmOTRiZQ==

/**
 * Component that displays current values of important graph settings
 * Positioned to the right of the toolbar at the bottom-left corner
 */
const SettingsDisplay = () => {
  const { t } = useTranslation()
  const graphQueryMaxDepth = useSettingsStore.use.graphQueryMaxDepth()
  const graphMaxNodes = useSettingsStore.use.graphMaxNodes()

  return (
    <div className="absolute bottom-4 left-[calc(1rem+2.5rem)] flex items-center gap-2 text-xs text-gray-400">
      <div>{t('graphPanel.sideBar.settings.depth')}: {graphQueryMaxDepth}</div>
      <div>{t('graphPanel.sideBar.settings.max')}: {graphMaxNodes}</div>
    </div>
  )
}
// eslint-disable  MS8yOmFIVnBZMlhsaUpqbWxvYzZUMWQ0VFE9PTozNjdmOTRiZQ==

export default SettingsDisplay
