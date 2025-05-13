const translations = {
  en: {
    navbar: {
      agency: "Agency",
      services: "Services",
      cases: "Cases",
      blog: "Blog",
      contacts: "Contacts",
    },
    projectInquiry: {
      line1: "Tell us",
      line2: "about your project:",
      full: "Tell us about your project:",
    },
    projectInquiryFormLabels: {
      name: "Your name*",
      email: "Email*",
      phone: "Phone*",
      message: "Message*",
    },
    projectInquirySendButton: "Send",
    projectInquiryConsent: [
      'By clicking "Send," you consent',
      "to the processing of your personal data.",
    ],
    checkboxText: "I consent to the processing of my personal data",
    discussProjectButtonText: "Discuss Project",
    mobileFooter: {
      line1: "Web Development",
      line2: "& IT Team Enhancement",
      full: "Web Development & IT Team Enhancement",
      table: [
        ["Phone number", "Agency", "Blog"],
        ["email", "Services", "Questions"],
        ["address", "Cases", ""],
      ],
      phone: "+7 999 123 45 67",
      email: "hello@cyberia.studio",
      address: "Yarnykh St. 35, Office 10",
      questions: "Questions",
    },
  },
  he: {
    navbar: {
      agency: "סוכנות",
      services: "שירותים",
      cases: "תיקים",
      blog: "בלוג",
      contacts: "צור קשר",
    },
    projectInquiry: {
      line1: "ספר לנו",
      line2: "על הפרויקט שלך:",
      full: "ספר לנו על הפרויקט שלך:",
    },
    projectInquiryFormLabels: {
      name: "השם שלך*",
      email: "אימייל*",
      phone: "מספר*",
      message: "הודעה*",
    },
    projectInquirySendButton: "שליחה",
    projectInquiryConsent: [
      'בלחיצה על "שליחה" אתה מסכים',
      "לעיבוד הנתונים האישיים שלך.",
    ],
    checkboxText: "אני מסכים לעיבוד הנתונים האישיים שלי",
    discussProjectButtonText: "לדון בפרויקט",
    mobileFooter: {
      line1: "פיתוח אתרים",
      line2: "והעצמת צוותי IT",
      full: "פיתוח אתרים והעצמת צוותי IT",
      table: [
        ["מספר טלפון", "סוכנות", "בלוג"],
        ["אימייל", "שירותים", "שאלות"],
        ["כתובת", "תיקים", ""],
      ],
      phone: "+7 999 123 45 67",
      email: "hello@cyberia.studio",
      address: "רחוב יארניך 35, משרד 10",
      questions: "שאלות",
    },
  },
  ru: {
    navbar: {
      agency: "Агентство",
      services: "Услуги",
      cases: "Кейсы",
      blog: "Блог",
      contacts: "Контакты",
    },
    projectInquiry: {
      line1: "Расскажите",
      line2: "о вашем проекте:",
      full: "Расскажите о вашем проекте:",
    },
    projectInquiryFormLabels: {
      name: "Ваше имя*",
      email: "Email*",
      phone: "Телефон*",
      message: "Сообщение*",
    },
    projectInquirySendButton: "Отправить",
    projectInquiryConsent: [
      'Нажимая "Отправить", вы даёте согласие',
      "на обработку ваших персональных данных.",
    ],
    checkboxText: "Согласие на обработку персональных данных",
    discussProjectButtonText: "Обсудить проект",
    mobileFooter: {
      line1: "Web-разработка",
      line2: "и усиление IT-команд",
      full: "Web-разработка и усиление IT-команд",
      table: [
        ["Телефон", "Агентство", "Блог"],
        ["email", "Услуги", "Вопросы"],
        ["адрес", "Кейсы", ""],
      ],
      phone: "+7 999 123 45 67",
      email: "hello@cyberia.studio",
      address: "ул. Ярных, д.35, оф.10",
      questions: "Вопросы",
    },
  },
} as const;

export default translations;
