// Romantic Site Configurations
// You can edit the values below to change texts, passwords, dates, or audio paths easily.

const CONFIG = {
  // Access password
  password: "rana",

  // Audio settings
  // Place your own click.mp3 and background.mp3 files in the project folder
  audio: {
    click: "click.mp3",
    background: "background.mp3",
    backgroundVolume: 0.6,
    clickVolume: 0.4
  },

  // Dates configuration
  dates: {
    // The text to display for the anniversary date on Screen 3
    displayDate: "05 / 03 / 2026",
    
    // The exact start date for the live counter (Year-Month-Day Hour:Minute:Second)
    // Counting since 05/03/2020 (March 5th, 2020)
    counterStart: "2020-03-05T00:00:00"
  },

  // Speed settings (in milliseconds)
  typingSpeed: 50, // milliseconds per character

  // Messages configuration
  messages: {
    // Password error messages
    errorFirst: "انتي شكلك مش رنا ❤️",
    errorSecond: "ركزي شويه ❤️",

    // Screen 2 Letter - Arabic text
    firstMessage: [
      "ازيك يا رنا ❤️",
      "كدا كدا عارف إني بزن كتير عشان نتكلم، وأنا آسف لو بضايقك أحيانًا.",
      "بس بجد يا رنا، أنا بحب أتكلم معاكي جدًا. لما بتكلم معاكي بحس إن الدنيا بتختلف، ولما بكون زعلان بتقدري تفرحيني بكلامك من غير ما تحاولي حتى.",
      "أنتِ بتهوني عليا يومي كله، وحتى لو إحنا متخانقين أو زعلانين من بعض، بفضل مبسوط لمجرد إني بكلمك.",
      "أنتِ حاجة حلوة أوي يا رنا، وشخص مميز جدًا بالنسبة لي. وجودك في حياتي بيخلي أيام كتير أحسن، وكلامك بيفرق معايا أكتر ما تتخيلي.",
      "وأعتقد إن أي حد يعرفك أو يكون قريب منك يتمنى وجودك في حياته، لأنك فعلًا شخص جميل بقلب جميل. ❤️"
    ],

    // Screen 3 text
    anniversaryText: "من اليوم ده بدأت أجمل قصة في حياتي ❤️",

    // Screen 4 Letter - Arabic text
    finalMessage: [
      "مش قصدي أي حاجة، بس أنا بحبك كتير يا رنا ❤️",
      "أنا بحب كل حاجة فيكي، وكل تفصيلة صغيرة بتخليكي مميزة بالنسبالي.",
      "عارف إن كلامي ساعات بيبقى ملخبط أو شكله أهبل شوية، بس الحقيقة إني مش بعرف أوصف مشاعري كويس. ساعات ببقى عايز أقول حاجات كتير جدًا، لكن لما أجي أتكلم بتطلع الكلمات غلط أو مش بتوصل المعنى اللي جوايا.",
      "يمكن أكون غلطت قبل كده، ويمكن قلت كلام مكانش المفروض يتقال، لكن عمري ما كان قصدي أزعلك أو أخسرك.",
      "كل اللي نفسي تعرفيه إن وجودك بيفرق معايا جدًا، وإن كلامك وضحكتك ووجودك في يومي ليهم مكانة كبيرة عندي.",
      "ومهما كانت كلماتي قليلة أو مش بعرف أعبر صح، فالحقيقة البسيطة هي:",
      "أنا بحبك يا رنا ❤️"
    ]
  }
};
