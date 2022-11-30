// DOM
const $html = document.querySelector('html')
const $themeToggleVanilla = document.getElementById('theme-link-vanilla')
const $themeToggleChocolate = document.getElementById('theme-link-chocolate')

// VARS
let isVanillaTheme = $html.classList.contains('theme-vanilla') ? "vanilla" : "chocolate"

// CALLBACKS
onThemeChange = ev => {
  $html.classList.toggle("theme-vanilla")
  $html.classList.toggle("theme-chocolate")
  $themeToggleVanilla.classList.toggle("theme-link-selected")
  $themeToggleVanilla.classList.toggle("theme-link-deselected")
  $themeToggleChocolate.classList.toggle("theme-link-selected")
  $themeToggleChocolate.classList.toggle("theme-link-deselected")

  isVanillaTheme = !isVanillaTheme
}
onVanilla = ev => {
  if (isVanillaTheme) return
  onThemeChange(ev)
}
onChocolate = ev => {
  if (!isVanillaTheme) return
  onThemeChange(ev)
}

// LISTENERS
$themeToggleVanilla.addEventListener('click', onVanilla)
$themeToggleChocolate.addEventListener('click', onChocolate)
