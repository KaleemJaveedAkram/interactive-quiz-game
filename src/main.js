import './style.css'

const questions = [
  { category: 'SCIENCE', question: 'Which planet has the most moons in our solar system?', answers: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'], correct: 1 },
  { category: 'GEOGRAPHY', question: 'What is the smallest country in the world?', answers: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], correct: 2 },
  { category: 'NATURE', question: 'What is the only mammal capable of true flight?', answers: ['Flying squirrel', 'Sugar glider', 'Bat', 'Colugo'], correct: 2 },
  { category: 'ART & CULTURE', question: 'Who painted the famous work “The Starry Night”?', answers: ['Claude Monet', 'Vincent van Gogh', 'Paul Cézanne', 'Pablo Picasso'], correct: 1 },
  { category: 'TECHNOLOGY', question: 'What does the “HTTP” in a web address stand for?', answers: ['HyperText Transfer Protocol', 'High Tech Text Process', 'Home Tool Transfer Program', 'Hyperlink Text Tracking Protocol'], correct: 0 },
  { category: 'SCIENCE', question: 'What is the chemical symbol for gold?', answers: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
  { category: 'GEOGRAPHY', question: 'Which city is famously built across 14 islands?', answers: ['Copenhagen', 'Stockholm', 'Amsterdam', 'Helsinki'], correct: 1 },
  { category: 'NATURE', question: 'How many hearts does an octopus have?', answers: ['One', 'Two', 'Three', 'Four'], correct: 2 },
  { category: 'ART & CULTURE', question: 'Which instrument has 88 keys?', answers: ['Harp', 'Accordion', 'Piano', 'Organ'], correct: 2 },
  { category: 'TECHNOLOGY', question: 'What was the first feature-length animated film?', answers: ['Fantasia', 'Pinocchio', 'Snow White and the Seven Dwarfs', 'Bambi'], correct: 2 },
]

const app = document.querySelector('#app')
let index = 0
let score = 0
let selected = null
let locked = false
let startedAt = 0
let timerId
const letters = ['A', 'B', 'C', 'D']
const icon = (name, cls = 'size-5') => {
  const paths = {
    spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4ZM7 7H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5A7 7 0 0 0 18.4 15"/>',
  }
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
}

function shell(content) {
  app.innerHTML = `<main class="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8"><header class="flex items-center justify-between py-6 sm:py-8"><a href="#" class="flex items-center gap-2.5 text-inherit no-underline" aria-label="Quizly home"><span class="grid size-10 place-items-center rounded-2xl bg-[#7168f2] text-white shadow-lg shadow-indigo-200">${icon('spark', 'size-5')}</span><span class="display-font text-xl font-bold tracking-tight">quizly<span class="text-[#756cf2]">.</span></span></a><div class="hidden items-center gap-2 text-sm font-semibold text-slate-500 sm:flex">${icon('spark', 'size-4 text-violet-500')} A little brain workout</div><span class="rounded-full border border-indigo-100 bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-500">DAILY QUIZ</span></header>${content}<footer class="mt-auto flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-400 sm:flex-row"><span>Made for curious minds <span class="text-rose-400">♥</span></span><span>10 questions · 5 minutes · 1 big brain</span></footer></main>`
}

function renderHome() {
  clearInterval(timerId)
  shell(`<section class="fade-in flex flex-1 items-center justify-center py-8"><div class="grid w-full max-w-4xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><div class="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">${icon('spark', 'size-3.5')} YOUR 5-MINUTE BRAIN BREAK</div><h1 class="display-font max-w-xl text-5xl font-bold leading-[1.06] tracking-[-.055em] text-slate-900 sm:text-6xl">Curiosity looks <span class="relative inline-block text-[#7168f2]">good on you<span class="absolute -bottom-1 left-1 h-2 w-[96%] -rotate-1 rounded-full bg-amber-300/70"></span></span></h1><p class="mt-6 max-w-lg text-lg leading-8 text-slate-500">Ten quick questions. A handful of fun facts. And a tiny victory to carry into your day.</p><div class="mt-8 flex flex-wrap items-center gap-4"><button id="start" class="group inline-flex items-center gap-3 rounded-2xl bg-[#7168f2] px-6 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#5e55e3]">Let’s play ${icon('arrow', 'size-4 transition group-hover:translate-x-1')}</button><span class="text-sm font-medium text-slate-400">No pressure. Just for fun.</span></div><div class="mt-10 flex items-center gap-3"><div class="flex -space-x-2"><span class="grid size-8 place-items-center rounded-full border-2 border-[#f5f7ff] bg-amber-200 text-sm">🧠</span><span class="grid size-8 place-items-center rounded-full border-2 border-[#f5f7ff] bg-emerald-200 text-sm">✨</span><span class="grid size-8 place-items-center rounded-full border-2 border-[#f5f7ff] bg-rose-200 text-sm">🎯</span></div><p class="text-sm text-slate-500"><strong class="text-slate-700">2,400+</strong> curious minds played today</p></div></div><div class="relative mx-auto w-full max-w-sm"><div class="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-indigo-200 via-violet-100 to-amber-100"></div><div class="relative overflow-hidden rounded-[2rem] border border-white bg-white p-7 shadow-2xl shadow-indigo-200/60"><div class="flex items-center justify-between"><div class="flex gap-1"><span class="size-2 rounded-full bg-rose-300"></span><span class="size-2 rounded-full bg-amber-300"></span><span class="size-2 rounded-full bg-emerald-300"></span></div><span class="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-violet-500">QUICK QUIZ</span></div><div class="mt-8 grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-[#f1efff] via-[#f9f8ff] to-[#fff7e8]"><div class="text-center"><div class="mx-auto grid size-28 place-items-center rounded-[2rem] bg-white text-6xl shadow-xl shadow-indigo-100">🪐</div><p class="display-font mt-5 text-xl font-bold text-slate-800">Out of this world</p><p class="mt-1 text-sm text-slate-400">A universe of things to know</p></div><span class="absolute right-12 top-28 rotate-12 text-2xl">✦</span><span class="absolute bottom-32 left-11 -rotate-12 text-2xl text-amber-400">✦</span></div><div class="mt-6 flex items-center justify-between"><div><p class="text-xs font-bold tracking-widest text-slate-400">UP NEXT</p><p class="mt-1 font-bold text-slate-700">10 curious questions</p></div><div class="grid size-11 place-items-center rounded-2xl bg-amber-100 text-xl">💡</div></div></div><div class="absolute -bottom-5 -left-8 flex items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl"><span class="grid size-9 place-items-center rounded-xl bg-emerald-100 text-lg">⚡</span><div><p class="text-xs font-bold text-slate-700">5 minutes</p><p class="text-[10px] text-slate-400">That's all it takes</p></div></div></div></div></section>`)
  document.querySelector('#start').addEventListener('click', startQuiz)
}

function startQuiz() { index = 0; score = 0; selected = null; locked = false; startedAt = Date.now(); renderQuestion() }

function renderQuestion() {
  const q = questions[index]
  const progress = (index / questions.length) * 100
  shell(`<section class="fade-in flex flex-1 items-center justify-center py-6"><div class="w-full max-w-2xl"><div class="mb-5 flex items-center justify-between"><button id="quit" class="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition hover:text-slate-700">${icon('back', 'size-4')} Exit quiz</button><div class="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500">${icon('clock', 'size-4 text-violet-500')} <span id="timer">00:00</span></div></div><div class="mb-8"><div class="mb-2 flex items-center justify-between text-xs font-bold tracking-wide"><span class="text-slate-500">QUESTION ${String(index + 1).padStart(2, '0')} <span class="text-slate-300">/ ${questions.length}</span></span><span class="text-violet-500">${Math.round(progress)}% COMPLETE</span></div><div class="h-2 overflow-hidden rounded-full bg-indigo-100"><div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500" style="width:${progress}%"></div></div></div><div class="rounded-[2rem] border border-white bg-white p-6 shadow-xl shadow-indigo-100/60 sm:p-9"><div class="mb-5 inline-flex rounded-lg bg-violet-50 px-2.5 py-1 text-[10px] font-extrabold tracking-[.16em] text-violet-600">${q.category}</div><h1 class="display-font text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl">${q.question}</h1><p class="mt-2 text-sm text-slate-400">Choose the best answer</p><div class="mt-7 grid gap-3" id="answers">${q.answers.map((answer, i) => `<button data-answer="${i}" class="answer-option flex w-full items-center gap-4 rounded-2xl border border-slate-200 px-4 py-4 text-left text-sm font-semibold text-slate-700 sm:px-5"><span class="letter grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold text-slate-500">${letters[i]}</span><span class="flex-1">${answer}</span><span class="result-icon hidden"></span></button>`).join('')}</div><div class="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><span id="feedback" class="text-sm font-semibold text-slate-400">Select an answer to continue</span><button id="next" disabled class="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400 transition disabled:cursor-not-allowed enabled:bg-[#7168f2] enabled:text-white enabled:shadow-lg enabled:shadow-indigo-200 enabled:hover:bg-[#5e55e3]">${index === questions.length - 1 ? 'See results' : 'Next question'} ${icon('arrow', 'size-4')}</button></div></div><p class="mt-4 text-center text-xs text-slate-400">Tip: trust your first instinct ✨</p></div></section>`)
  document.querySelector('#quit').addEventListener('click', renderHome)
  document.querySelectorAll('[data-answer]').forEach(btn => btn.addEventListener('click', () => chooseAnswer(Number(btn.dataset.answer))))
  document.querySelector('#next').addEventListener('click', () => { if (!locked) return; if (index === questions.length - 1) renderResults(); else { index++; selected = null; locked = false; renderQuestion() } })
  updateTimer(); timerId = setInterval(updateTimer, 1000)
}

function updateTimer() { const el = document.querySelector('#timer'); if (!el) return; const seconds = Math.floor((Date.now() - startedAt) / 1000); el.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` }

function chooseAnswer(choice) {
  if (locked) return
  selected = choice; locked = true
  const correct = questions[index].correct
  if (choice === correct) score++
  document.querySelectorAll('[data-answer]').forEach(btn => {
    const answerIndex = Number(btn.dataset.answer)
    btn.disabled = true
    if (answerIndex === correct) { btn.classList.add('correct'); btn.querySelector('.letter').classList.replace('bg-slate-100', 'bg-emerald-100'); btn.querySelector('.letter').classList.replace('text-slate-500', 'text-emerald-700'); btn.querySelector('.result-icon').innerHTML = icon('check', 'size-5 text-emerald-600'); btn.querySelector('.result-icon').classList.remove('hidden') }
    else if (answerIndex === choice) { btn.classList.add('incorrect'); btn.querySelector('.letter').classList.replace('bg-slate-100', 'bg-rose-100'); btn.querySelector('.letter').classList.replace('text-slate-500', 'text-rose-600'); btn.querySelector('.result-icon').innerHTML = icon('close', 'size-5 text-rose-500'); btn.querySelector('.result-icon').classList.remove('hidden') }
  })
  const feedback = document.querySelector('#feedback')
  feedback.textContent = choice === correct ? 'Exactly right! Nice one 🎉' : `Not quite — the answer is ${questions[index].answers[correct]}`
  feedback.className = `text-sm font-semibold ${choice === correct ? 'text-emerald-600' : 'text-rose-500'}`
  document.querySelector('#next').disabled = false
}

function renderResults() {
  clearInterval(timerId)
  const elapsed = Math.floor((Date.now() - startedAt) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const percent = Math.round((score / questions.length) * 100)
  const result = percent === 100 ? ['Absolutely brilliant!', 'You got every answer right. Your curiosity is unstoppable.', '🏆'] : percent >= 70 ? ['Nicely done!', 'A sharp mind and a great run. Look at you go.', '🌟'] : percent >= 40 ? ['Good things brewing!', 'You’ve got a curious mind. There’s always more to discover.', '🧠'] : ['That was a warm-up!', 'Every great quizzer starts somewhere. Fancy another round?', '🌱']
  shell(`<section class="fade-in flex flex-1 items-center justify-center py-6"><div class="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-indigo-100/70"><div class="relative bg-gradient-to-br from-violet-600 to-indigo-500 px-8 pb-12 pt-10 text-center text-white sm:px-12"><div class="absolute -right-8 -top-12 size-40 rounded-full border-[24px] border-white/10"></div><div class="absolute -left-9 bottom-0 size-28 rounded-full bg-white/5"></div><div class="relative mx-auto grid size-20 place-items-center rounded-[1.75rem] bg-white/15 text-4xl shadow-inner">${result[2]}</div><p class="relative mt-5 text-xs font-bold tracking-[.22em] text-indigo-100">QUIZ COMPLETE</p><h1 class="display-font relative mt-2 text-3xl font-bold tracking-tight sm:text-4xl">${result[0]}</h1><p class="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-indigo-100">${result[1]}</p></div><div class="px-7 pb-8 sm:px-10"><div class="relative -mt-7 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-white py-5 shadow-lg shadow-indigo-100/40"><div class="text-center"><p class="display-font text-2xl font-bold text-slate-800">${score}<span class="text-base text-slate-300">/10</span></p><p class="mt-1 text-[10px] font-bold tracking-widest text-slate-400">SCORE</p></div><div class="text-center"><p class="display-font text-2xl font-bold text-slate-800">${percent}<span class="text-base text-slate-400">%</span></p><p class="mt-1 text-[10px] font-bold tracking-widest text-slate-400">ACCURACY</p></div><div class="text-center"><p class="display-font text-2xl font-bold text-slate-800">${time}</p><p class="mt-1 text-[10px] font-bold tracking-widest text-slate-400">TIME</p></div></div><div class="mt-6 rounded-xl bg-[#f6f5ff] px-4 py-3 text-center text-sm text-slate-600"><span class="mr-1">✨</span> You got <strong class="text-violet-600">${score}</strong> out of <strong>10</strong> questions right!</div><button id="again" class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7168f2] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#5e55e3]">${icon('refresh', 'size-4')} Play again</button><button id="home" class="mt-3 w-full rounded-xl px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">Back to home</button></div></div></section>`)
  document.querySelector('#again').addEventListener('click', startQuiz)
  document.querySelector('#home').addEventListener('click', renderHome)
}

renderHome()
