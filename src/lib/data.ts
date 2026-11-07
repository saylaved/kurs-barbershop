/**
 * Site content. Texts, prices and contacts come from kurs-barbershop.com.
 * Barber names, bios and reviews are PLACEHOLDERS — the original site does
 * not list them. Replace them here; every component reads from this file.
 */

export type Service = {
  id: string
  title: string
  description: string
  duration: string
  minutes: number
  priceFrom: number
  priceTo: number
}

export const services: Service[] = [
  {
    id: "classic",
    title: "Чоловіча стрижка",
    description:
      "Класична стрижка машинкою та ножицями або машинкою з переходами в техніці фейд. Включає миття голови.",
    duration: "1 година",
    minutes: 60,
    priceFrom: 600,
    priceTo: 900,
  },
  {
    id: "long",
    title: "Подовжена стрижка",
    description:
      "Стрижка, повністю виконана ножицями, або стрижка волосся, яке лягає нижче вух.",
    duration: "1,5 години",
    minutes: 90,
    priceFrom: 700,
    priceTo: 1100,
  },
  {
    id: "clipper",
    title: "Стрижка машинкою",
    description:
      "Стрижка під одну насадку або шейвер без переходів і фейду.",
    duration: "до 30 хвилин",
    minutes: 30,
    priceFrom: 350,
    priceTo: 700,
  },
  {
    id: "beard",
    title: "Стрижка бороди",
    description:
      "Стрижка бороди машинкою та ножицями з рекомендаціями щодо догляду. Небезпечна бритва чи електробритва — обираємо в процесі.",
    duration: "30 хвилин",
    minutes: 30,
    priceFrom: 400,
    priceTo: 600,
  },
  {
    id: "camo",
    title: "Камуфлювання сивини",
    description:
      "Вирівнювання кольору волосся до однорідного відтінку. Добре підходить для волосся з сивиною або бороди з різними відтінками.",
    duration: "30 хвилин",
    minutes: 30,
    priceFrom: 550,
    priceTo: 650,
  },
  {
    id: "kids",
    title: "Дитяча стрижка",
    description:
      "Стрижка для юного чоловіка віком від п’яти до десяти років. Ваш хлопець молодший? Підкажемо, де його приймуть.",
    duration: "40–60 хвилин",
    minutes: 50,
    priceFrom: 550,
    priceTo: 800,
  },
]

export type Review = { author: string; text: string; rating: number }

export type Barber = {
  id: string
  name: string
  role: string
  experience: string
  specialties: string[]
  reviews: Review[]
}

// PLACEHOLDER barbers and reviews — replace with the real team.
export const barbers: Barber[] = [
  {
    id: "oleksandr",
    name: "Олександр",
    role: "Топ-барбер",
    experience: "8 років досвіду",
    specialties: ["Фейд", "Ножиці"],
    reviews: [
      { author: "Андрій", rating: 5, text: "Ідеальний фейд, жодної зайвої лінії. Тримається два тижні як з голки." },
      { author: "Максим", rating: 5, text: "Підібрав форму під моє обличчя — тепер укладка займає хвилину." },
      { author: "Ігор", rating: 5, text: "Спокійно, впевнено, без поспіху. Найкраща стрижка за роки." },
    ],
  },
  {
    id: "dmytro",
    name: "Дмитро",
    role: "Барбер-наставник",
    experience: "10 років досвіду",
    specialties: ["Подовжені", "Навчання"],
    reviews: [
      { author: "Олег", rating: 5, text: "Довге волосся довіряю тільки йому. Розуміє з пів слова." },
      { author: "Сергій", rating: 5, text: "Порадив догляд, і волосся нарешті лягає саме." },
      { author: "Роман", rating: 5, text: "Атмосфера, кава, розмова — і бездоганний результат." },
    ],
  },
  {
    id: "artem",
    name: "Артем",
    role: "Барбер",
    experience: "5 років досвіду",
    specialties: ["Борода", "Гоління"],
    reviews: [
      { author: "Віталій", rating: 5, text: "Борода нарешті має форму. Гоління небезпечною бритвою — окремий кайф." },
      { author: "Тарас", rating: 5, text: "Акуратно, чисто, з душею. Рекомендую всім друзям." },
      { author: "Богдан", rating: 5, text: "Камуфлювання сивини виглядає природно — ніхто не здогадався." },
    ],
  },
  {
    id: "mykyta",
    name: "Микита",
    role: "Барбер",
    experience: "4 роки досвіду",
    specialties: ["Машинка", "Дитячі"],
    reviews: [
      { author: "Олена", rating: 5, text: "Син уперше сидів спокійно всю стрижку. Дякуємо за терпіння!" },
      { author: "Денис", rating: 5, text: "Швидко і рівно під одну насадку. Саме те, що треба." },
      { author: "Юрій", rating: 5, text: "Чітко, по часу, без зайвих слів. Мій барбер." },
    ],
  },
]

export const gallery = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  src: `/img/gallery/${n}.jpg`,
  alt: `Робота майстрів KURS, фото ${n}`,
}))

export const contacts = {
  hours: "10:00–21:00",
  openHour: 10,
  closeHour: 21,
  city: "Київ",
  address: "просп. Правди, 41в",
  phones: [
    { label: "+380 93 616 42 22", href: "tel:+380936164222" },
    { label: "+380 50 616 42 22", href: "tel:+380506164222" },
  ],
  email: "kurs.barbershop@gmail.com",
  socials: [
    { label: "Instagram", href: "https://instagram.com/kurs_barbershop" },
    { label: "Facebook", href: "https://www.facebook.com/kurs.barbershop" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCi5fbKv-EqohWdyUrhFoz5A" },
    { label: "Telegram", href: "https://t.me/+380936164222" },
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2537.7202318658146!2d30.42429331573335!3d50.50216447948249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cd704613027b%3A0xf3560c9a6ced7c06!2z0L_RgNC-0YHQvy4g0J_RgNCw0LLQtNGLLCA0MdCSLCDQmtC40LXQsiwgMDIwMDA!5e0!3m2!1suk!2sua!4v1594995293900!5m2!1suk!2sua",
}

export const nav = [
  { href: "#about", label: "Про нас" },
  { href: "#services", label: "Послуги" },
  { href: "#team", label: "Команда" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contacts", label: "Контакти" },
]

const uah = new Intl.NumberFormat("uk-UA")

export function formatPrice(n: number) {
  return `${uah.format(n)}\u00A0₴`
}

export function formatRange(from: number, to: number) {
  return `${uah.format(from)}–${uah.format(to)}\u00A0₴`
}
