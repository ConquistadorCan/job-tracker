const TRANSLATIONS = {
  en: {
    // Header stats
    statTotal: "Total",
    statInterviews: "Interviews",
    statRejected: "Rejected",

    // Table
    tableTitle: "Applications",
    searchPlaceholder: "Search by company...",
    filterAll: "All Status",
    btnAdd: "+ Add",
    colCompany: "Company",
    colPosition: "Position",
    colDateApplied: "Date Applied",
    colCity: "City",
    colJobType: "Job Type",
    colSalary: "Expected Salary",
    colStatus: "Status",

    // Modal
    modalTitle: "New Application",
    placeholderCompany: "Company",
    placeholderPosition: "Position",
    placeholderCity: "City",
    placeholderSalary: "Expected Salary",
    btnSave: "Save Application",

    // Job types
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",

    // Statuses
    pending: "Pending",
    interview: "Interview",
    accepted: "Accepted",
    rejected: "Rejected",

    // Confirm modal
    confirmTitle: "Delete Application",
    confirmMessage:
      "Are you sure you want to delete this application? This action cannot be undone.",
    btnCancel: "Cancel",
    btnDelete: "Delete",

    // Validation errors
    errorCompany: "Company is required.",
    errorPosition: "Position is required.",
    errorDate: "Date is required.",

    // Disclaimer
    disclaimerText:
      'Data stored locally nothing sent to any server. Provided "as is".',

    // Table counter
    noApplications: "No applications found",
    showingOne: "Showing 1 application",
    showingMany: (n) => `Showing ${n} applications`,

    // Empty state
    emptyTitle: "No applications yet",
    emptySubtitle: "JAT helps you track your job applications in one place.",
    emptyAction: "Click + Add to add your first application",

    // Settings
    settingsTitle: "Settings",
    settingsBack: "← Back",
    settingsLangTitle: "Language",
    settingsLangDesc: "Display language for the interface",
    settingsThemeTitle: "Theme",
    settingsThemeDesc: "Choose your preferred color theme",
    settingsSeparatorTitle: "Thousands Separator",
    settingsSeparatorDesc: "Format used for salary display",
    settingsCurrencyTitle: "Default Currency",
    settingsCurrencyDesc: "Pre-selected currency when adding a new application",
    settingsStatusTitle: "Default Status",
    settingsStatusDesc: "Pre-selected status when adding a new application",
    settingsJobTypeTitle: "Default Job Type",
    settingsJobTypeDesc: "Pre-selected job type when adding a new application",
    settingsPositionTitle: "Position Suggestions",
    settingsPositionDesc: "Press Enter to add a new suggestion",
    settingsCityTitle: "City Suggestions",
    settingsCityDesc: "Press Enter to add a new suggestion",
    btnSaveSettings: "Save Settings",
  },

  tr: {
    // Header stats
    statTotal: "Toplam",
    statInterviews: "Mülakatlar",
    statRejected: "Reddedilenler",

    // Table
    tableTitle: "Başvurular",
    searchPlaceholder: "Şirkete göre ara...",
    filterAll: "Tüm Durumlar",
    btnAdd: "+ Ekle",
    colCompany: "Şirket",
    colPosition: "Pozisyon",
    colDateApplied: "Başvuru Tarihi",
    colCity: "Şehir",
    colJobType: "Çalışma Tipi",
    colSalary: "Beklenen Maaş",
    colStatus: "Durum",

    // Modal
    modalTitle: "Yeni Başvuru",
    placeholderCompany: "Şirket",
    placeholderPosition: "Pozisyon",
    placeholderCity: "Şehir",
    placeholderSalary: "Beklenen Maaş",
    btnSave: "Başvuruyu Kaydet",

    // Job types
    remote: "Uzaktan",
    onsite: "Ofis",
    hybrid: "Hibrit",

    // Statuses
    pending: "Beklemede",
    interview: "Mülakat",
    accepted: "Kabul",
    rejected: "Reddedildi",

    // Confirm modal
    confirmTitle: "Başvuruyu Sil",
    confirmMessage:
      "Bu başvuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
    btnCancel: "İptal",
    btnDelete: "Sil",

    // Validation errors
    errorCompany: "Şirket alanı zorunludur.",
    errorPosition: "Pozisyon alanı zorunludur.",
    errorDate: "Tarih alanı zorunludur.",

    // Disclaimer
    disclaimerText:
      'Veriler yalnızca tarayıcınızda saklanır hiçbir sunucuya gönderilmez. "Olduğu gibi" sunulmaktadır.',

    // Table counter
    noApplications: "Başvuru bulunamadı",
    showingOne: "1 başvuru gösteriliyor",
    showingMany: (n) => `${n} başvuru gösteriliyor`,

    // Empty state
    emptyTitle: "Henüz başvuru yok",
    emptySubtitle: "JAT, iş başvurularını tek bir yerde takip etmeni sağlar.",
    emptyAction: "+ Ekle butonuna tıklayarak ilk başvurunu ekle",

    // Settings
    settingsTitle: "Ayarlar",
    settingsBack: "← Geri",
    settingsLangTitle: "Dil",
    settingsLangDesc: "Arayüz görüntüleme dili",
    settingsThemeTitle: "Tema",
    settingsThemeDesc: "Tercih ettiğiniz renk temasını seçin",
    settingsSeparatorTitle: "Binlik Ayraç",
    settingsSeparatorDesc: "Maaş gösterimi için kullanılan format",
    settingsCurrencyTitle: "Varsayılan Para Birimi",
    settingsCurrencyDesc: "Yeni başvuru eklerken önceden seçili para birimi",
    settingsStatusTitle: "Varsayılan Durum",
    settingsStatusDesc: "Yeni başvuru eklerken önceden seçili durum",
    settingsJobTypeTitle: "Varsayılan Çalışma Tipi",
    settingsJobTypeDesc: "Yeni başvuru eklerken önceden seçili çalışma tipi",
    settingsPositionTitle: "Pozisyon Önerileri",
    settingsPositionDesc: "Öneri eklemek için Enter'a bas",
    settingsCityTitle: "Şehir Önerileri",
    settingsCityDesc: "Öneri eklemek için Enter'a bas",
    btnSaveSettings: "Ayarları Kaydet",
  },

  es: {
    // Header stats
    statTotal: "Total",
    statInterviews: "Entrevistas",
    statRejected: "Rechazadas",

    // Table
    tableTitle: "Solicitudes",
    searchPlaceholder: "Buscar por empresa...",
    filterAll: "Todos los estados",
    btnAdd: "+ Añadir",
    colCompany: "Empresa",
    colPosition: "Puesto",
    colDateApplied: "Fecha de solicitud",
    colCity: "Ciudad",
    colJobType: "Tipo de trabajo",
    colSalary: "Salario esperado",
    colStatus: "Estado",

    // Modal
    modalTitle: "Nueva solicitud",
    placeholderCompany: "Empresa",
    placeholderPosition: "Puesto",
    placeholderCity: "Ciudad",
    placeholderSalary: "Salario esperado",
    btnSave: "Guardar solicitud",

    // Job types
    remote: "Remoto",
    onsite: "Presencial",
    hybrid: "Híbrido",

    // Statuses
    pending: "Pendiente",
    interview: "Entrevista",
    accepted: "Aceptada",
    rejected: "Rechazada",

    // Confirm modal
    confirmTitle: "Eliminar solicitud",
    confirmMessage:
      "¿Seguro que quieres eliminar esta solicitud? Esta acción no se puede deshacer.",
    btnCancel: "Cancelar",
    btnDelete: "Eliminar",

    // Validation errors
    errorCompany: "La empresa es obligatoria.",
    errorPosition: "El puesto es obligatorio.",
    errorDate: "La fecha es obligatoria.",

    // Disclaimer
    disclaimerText:
      'Datos almacenados localmente nada se envía a ningún servidor. Proporcionado "tal cual".',

    // Table counter
    noApplications: "No se encontraron solicitudes",
    showingOne: "Mostrando 1 solicitud",
    showingMany: (n) => `Mostrando ${n} solicitudes`,

    // Empty state
    emptyTitle: "Todavía no hay solicitudes",
    emptySubtitle:
      "JAT te ayuda a seguir tus solicitudes de trabajo en un solo lugar.",
    emptyAction: "Haz clic en + Añadir para agregar tu primera solicitud",

    // Settings
    settingsTitle: "Ajustes",
    settingsBack: "← Volver",
    settingsLangTitle: "Idioma",
    settingsLangDesc: "Idioma de visualización de la interfaz",
    settingsThemeTitle: "Tema",
    settingsThemeDesc: "Elige tu tema de color preferido",
    settingsSeparatorTitle: "Separador de miles",
    settingsSeparatorDesc: "Formato usado para mostrar el salario",
    settingsCurrencyTitle: "Moneda por defecto",
    settingsCurrencyDesc:
      "Moneda preseleccionada al añadir una nueva solicitud",
    settingsStatusTitle: "Estado por defecto",
    settingsStatusDesc: "Estado preseleccionado al añadir una nueva solicitud",
    settingsJobTypeTitle: "Tipo de trabajo por defecto",
    settingsJobTypeDesc:
      "Tipo de trabajo preseleccionado al añadir una nueva solicitud",
    settingsPositionTitle: "Sugerencias de puestos",
    settingsPositionDesc: "Pulsa Enter para añadir una nueva sugerencia",
    settingsCityTitle: "Sugerencias de ciudades",
    settingsCityDesc: "Pulsa Enter para añadir una nueva sugerencia",
    btnSaveSettings: "Guardar ajustes",
  },

  de: {
    // Header stats
    statTotal: "Gesamt",
    statInterviews: "Vorstellungen",
    statRejected: "Abgelehnt",

    // Table
    tableTitle: "Bewerbungen",
    searchPlaceholder: "Nach Firma suchen...",
    filterAll: "Alle Status",
    btnAdd: "+ Hinzufügen",
    colCompany: "Firma",
    colPosition: "Position",
    colDateApplied: "Bewerbungsdatum",
    colCity: "Stadt",
    colJobType: "Stellenart",
    colSalary: "Erwartetes Gehalt",
    colStatus: "Status",

    // Modal
    modalTitle: "Neue Bewerbung",
    placeholderCompany: "Firma",
    placeholderPosition: "Position",
    placeholderCity: "Stadt",
    placeholderSalary: "Erwartetes Gehalt",
    btnSave: "Bewerbung speichern",

    // Job types
    remote: "Remote",
    onsite: "Vor Ort",
    hybrid: "Hybrid",

    // Statuses
    pending: "Ausstehend",
    interview: "Vorstellungsgespräch",
    accepted: "Angenommen",
    rejected: "Abgelehnt",

    // Confirm modal
    confirmTitle: "Bewerbung löschen",
    confirmMessage:
      "Bist du sicher, dass du diese Bewerbung löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
    btnCancel: "Abbrechen",
    btnDelete: "Löschen",

    // Validation errors
    errorCompany: "Das Feld Firma ist erforderlich.",
    errorPosition: "Das Feld Position ist erforderlich.",
    errorDate: "Das Feld Datum ist erforderlich.",

    // Disclaimer
    disclaimerText:
      'Daten werden lokal gespeichert nichts wird an Server gesendet. Wird "wie besehen" bereitgestellt.',

    // Table counter
    noApplications: "Keine Bewerbungen gefunden",
    showingOne: "1 Bewerbung wird angezeigt",
    showingMany: (n) => `${n} Bewerbungen werden angezeigt`,

    // Empty state
    emptyTitle: "Noch keine Bewerbungen",
    emptySubtitle:
      "JAT hilft dir, deine Bewerbungen an einem Ort zu verwalten.",
    emptyAction: "Klicke auf + Hinzufügen, um deine erste Bewerbung anzulegen",

    // Settings
    settingsTitle: "Einstellungen",
    settingsBack: "← Zurück",
    settingsLangTitle: "Sprache",
    settingsLangDesc: "Anzeigesprache der Benutzeroberfläche",
    settingsThemeTitle: "Design",
    settingsThemeDesc: "Wähle dein bevorzugtes Farbschema",
    settingsSeparatorTitle: "Tausendertrennzeichen",
    settingsSeparatorDesc: "Format, das für die Gehaltsanzeige verwendet wird",
    settingsCurrencyTitle: "Standardwährung",
    settingsCurrencyDesc:
      "Vorausgewählte Währung beim Hinzufügen einer neuen Bewerbung",
    settingsStatusTitle: "Standardstatus",
    settingsStatusDesc:
      "Vorausgewählter Status beim Hinzufügen einer neuen Bewerbung",
    settingsJobTypeTitle: "Standard-Stellenart",
    settingsJobTypeDesc:
      "Vorausgewählte Stellenart beim Hinzufügen einer neuen Bewerbung",
    settingsPositionTitle: "Positionsvorschläge",
    settingsPositionDesc: "Drücke Enter, um einen neuen Vorschlag hinzuzufügen",
    settingsCityTitle: "Stadtvorschläge",
    settingsCityDesc: "Drücke Enter, um einen neuen Vorschlag hinzuzufügen",
    btnSaveSettings: "Einstellungen speichern",
  },

  it: {
    // Header stats
    statTotal: "Totale",
    statInterviews: "Colloqui",
    statRejected: "Rifiutate",

    // Table
    tableTitle: "Candidature",
    searchPlaceholder: "Cerca per azienda...",
    filterAll: "Tutti gli stati",
    btnAdd: "+ Aggiungi",
    colCompany: "Azienda",
    colPosition: "Posizione",
    colDateApplied: "Data candidatura",
    colCity: "Città",
    colJobType: "Tipo di lavoro",
    colSalary: "Stipendio previsto",
    colStatus: "Stato",

    // Modal
    modalTitle: "Nuova candidatura",
    placeholderCompany: "Azienda",
    placeholderPosition: "Posizione",
    placeholderCity: "Città",
    placeholderSalary: "Stipendio previsto",
    btnSave: "Salva candidatura",

    // Job types
    remote: "Da remoto",
    onsite: "In sede",
    hybrid: "Ibrido",

    // Statuses
    pending: "In attesa",
    interview: "Colloquio",
    accepted: "Accettata",
    rejected: "Rifiutata",

    // Confirm modal
    confirmTitle: "Elimina candidatura",
    confirmMessage:
      "Sei sicuro di voler eliminare questa candidatura? Questa azione non può essere annullata.",
    btnCancel: "Annulla",
    btnDelete: "Elimina",

    // Validation errors
    errorCompany: "Il campo Azienda è obbligatorio.",
    errorPosition: "Il campo Posizione è obbligatorio.",
    errorDate: "Il campo Data è obbligatorio.",

    // Disclaimer
    disclaimerText:
      'Dati archiviati localmente nulla viene inviato a server. Fornito "così com\'è".',

    // Table counter
    noApplications: "Nessuna candidatura trovata",
    showingOne: "1 candidatura mostrata",
    showingMany: (n) => `${n} candidature mostrate`,

    // Empty state
    emptyTitle: "Ancora nessuna candidatura",
    emptySubtitle:
      "JAT ti aiuta a tenere traccia delle tue candidature in un unico posto.",
    emptyAction: "Fai clic su + Aggiungi per inserire la tua prima candidatura",

    // Settings
    settingsTitle: "Impostazioni",
    settingsBack: "← Indietro",
    settingsLangTitle: "Lingua",
    settingsLangDesc: "Lingua di visualizzazione dell'interfaccia",
    settingsThemeTitle: "Tema",
    settingsThemeDesc: "Scegli il tema colori preferito",
    settingsSeparatorTitle: "Separatore delle migliaia",
    settingsSeparatorDesc: "Formato usato per mostrare lo stipendio",
    settingsCurrencyTitle: "Valuta predefinita",
    settingsCurrencyDesc:
      "Valuta preselezionata quando aggiungi una nuova candidatura",
    settingsStatusTitle: "Stato predefinito",
    settingsStatusDesc:
      "Stato preselezionato quando aggiungi una nuova candidatura",
    settingsJobTypeTitle: "Tipo di lavoro predefinito",
    settingsJobTypeDesc:
      "Tipo di lavoro preselezionato quando aggiungi una nuova candidatura",
    settingsPositionTitle: "Suggerimenti per posizioni",
    settingsPositionDesc: "Premi Invio per aggiungere un nuovo suggerimento",
    settingsCityTitle: "Suggerimenti per città",
    settingsCityDesc: "Premi Invio per aggiungere un nuovo suggerimento",
    btnSaveSettings: "Salva impostazioni",
  },

  fr: {
    // Header stats
    statTotal: "Total",
    statInterviews: "Entretiens",
    statRejected: "Refusées",

    // Table
    tableTitle: "Candidatures",
    searchPlaceholder: "Rechercher par entreprise...",
    filterAll: "Tous les statuts",
    btnAdd: "+ Ajouter",
    colCompany: "Entreprise",
    colPosition: "Poste",
    colDateApplied: "Date de candidature",
    colCity: "Ville",
    colJobType: "Type d'emploi",
    colSalary: "Salaire attendu",
    colStatus: "Statut",

    // Modal
    modalTitle: "Nouvelle candidature",
    placeholderCompany: "Entreprise",
    placeholderPosition: "Poste",
    placeholderCity: "Ville",
    placeholderSalary: "Salaire attendu",
    btnSave: "Enregistrer la candidature",

    // Job types
    remote: "À distance",
    onsite: "Sur site",
    hybrid: "Hybride",

    // Statuses
    pending: "En attente",
    interview: "Entretien",
    accepted: "Acceptée",
    rejected: "Refusée",

    // Confirm modal
    confirmTitle: "Supprimer la candidature",
    confirmMessage:
      "Es-tu sûr de vouloir supprimer cette candidature ? Cette action est irréversible.",
    btnCancel: "Annuler",
    btnDelete: "Supprimer",

    // Validation errors
    errorCompany: "Le champ Entreprise est obligatoire.",
    errorPosition: "Le champ Poste est obligatoire.",
    errorDate: "Le champ Date est obligatoire.",

    // Disclaimer
    disclaimerText:
      'Données stockées localement rien n\'est envoyé à des serveurs. Fourni "tel quel".',

    // Table counter
    noApplications: "Aucune candidature trouvée",
    showingOne: "1 candidature affichée",
    showingMany: (n) => `${n} candidatures affichées`,

    // Empty state
    emptyTitle: "Aucune candidature pour l'instant",
    emptySubtitle: "JAT t'aide à suivre tes candidatures à un seul endroit.",
    emptyAction: "Clique sur + Ajouter pour créer ta première candidature",

    // Settings
    settingsTitle: "Paramètres",
    settingsBack: "← Retour",
    settingsLangTitle: "Langue",
    settingsLangDesc: "Langue d'affichage de l'interface",
    settingsThemeTitle: "Thème",
    settingsThemeDesc: "Choisis ton thème de couleur préféré",
    settingsSeparatorTitle: "Séparateur de milliers",
    settingsSeparatorDesc: "Format utilisé pour l'affichage du salaire",
    settingsCurrencyTitle: "Devise par défaut",
    settingsCurrencyDesc:
      "Devise présélectionnée lors de l'ajout d'une nouvelle candidature",
    settingsStatusTitle: "Statut par défaut",
    settingsStatusDesc:
      "Statut présélectionné lors de l'ajout d'une nouvelle candidature",
    settingsJobTypeTitle: "Type d'emploi par défaut",
    settingsJobTypeDesc:
      "Type d'emploi présélectionné lors de l'ajout d'une nouvelle candidature",
    settingsPositionTitle: "Suggestions de postes",
    settingsPositionDesc:
      "Appuie sur Entrée pour ajouter une nouvelle suggestion",
    settingsCityTitle: "Suggestions de villes",
    settingsCityDesc: "Appuie sur Entrée pour ajouter une nouvelle suggestion",
    btnSaveSettings: "Enregistrer les paramètres",
  },
};

function t(key, ...args) {
  const lang = getSettings().language || "en";
  const translation = TRANSLATIONS[lang][key];
  return typeof translation === "function" ? translation(...args) : translation;
}
