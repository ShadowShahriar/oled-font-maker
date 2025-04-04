const defaultFont = 'Consolas'
const defaultGlyphs =
	' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°'

// ==========================
// ==== update functions ====
// ==========================
const updateOutput = elm => {
	const output = elm.previousElementSibling.querySelector('code')
	output.innerText = `${elm.value}${output.getAttribute('data-unit')}`
}

const updateFontFamily = elm => {
	document.getElementById('previewElm').style.fontFamily = `"${elm}", ${defaultFont}, monospace`
	document.getElementById('glyphs').style.fontFamily = `"${elm}", ${defaultFont}, monospace`
}

const updateGlyphs = elm => {
	const allGlyphs = Array.from(new Set(elm.value.split(''))).join('')
	elm.value = allGlyphs.replace(/\n/gm, '')
	const previewElm = document.querySelector('#previewElm')
	previewElm.innerHTML = ''

	for (let i = 0, n = elm.value.length; i < n; i++) {
		const img = document.createElement('img')
		img.setAttribute('id', '__g' + i)
		previewElm.appendChild(img)
	}
}

// ===================================
// === handle font family updates ====
// ===================================
const fontFamily = document.querySelector('#fontFamily')
fontFamily.addEventListener('input', elm => {
	updateFontFamily(elm.target.value)
	render()
})
fontFamily.addEventListener('change', elm => {
	elm.target.value = elm.target.value.trim()
	updateFontFamily(elm.target.value)
	render()
})
updateFontFamily(fontFamily.value)

// ============================================
// === handle checkboxes and range sliders ====
// ============================================
document.querySelectorAll('input[type="checkbox"]').forEach(elm => elm.addEventListener('input', _ => render()))
document.querySelectorAll('input[type="range"]').forEach(elm => {
	elm.addEventListener('input', _ => {
		updateOutput(elm)
		render()
	})
	updateOutput(elm)
})

// =============================
// === handle glyph updates ====
// =============================
const glyphs = document.querySelector('#glyphs')
glyphs.value = defaultGlyphs
glyphs.addEventListener('input', elm => {
	updateGlyphs(elm.target)
	render()
})
glyphs.addEventListener('change', _ => render())
updateGlyphs(glyphs)

// ==================================
// === handle download functions ====
// ==================================
let timeOut1 = setTimeout(_ => {}, 10)
let timeOut2 = setTimeout(_ => {}, 10)
const btnCopy = document.querySelector('#copy')
const btnDownload = document.querySelector('#downloadBtn')

const copyCode = async () => {
	if (timeOut1) clearTimeout(timeOut1)
	btnCopy.setAttribute('data-done', 'true')
	timeOut1 = setTimeout(_ => btnCopy.setAttribute('data-done', 'false'), 2000)

	try {
		await navigator.clipboard.writeText(output)
		console.log('Copied to clipboard')
	} catch (err) {
		console.error('Failed to copy: ', err)
	}
}

const download = async () => {
	if (timeOut2) clearTimeout(timeOut2)
	btnDownload.setAttribute('data-done', 'true')
	timeOut2 = setTimeout(_ => btnDownload.setAttribute('data-done', 'false'), 2000)

	const blob = new Blob([output], { type: 'text/plain' })
	const fileURL = URL.createObjectURL(blob)
	const downloadLink = document.createElement('a')

	downloadLink.href = fileURL
	downloadLink.download = fileName
	document.body.appendChild(downloadLink)
	downloadLink.click()

	URL.revokeObjectURL(fileURL)
	document.body.removeChild(downloadLink)
}

btnCopy.addEventListener('click', copyCode)
btnDownload.addEventListener('click', download)

// ======================================
// ==== handle double click to reset ====
// ======================================
document.querySelectorAll('.option-div').forEach(item => {
	item.addEventListener('dblclick', _ => {
		const range = item.querySelector('input[type="range"]')
		range.value = +item.getAttribute('data-default')
		range.dispatchEvent(new Event('input'))
	})
})

render()
