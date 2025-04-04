const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.mozImageSmoothingEnabled = false
ctx.webkitImageSmoothingEnabled = false

let fileName = 'test.js'
let colors = {
	foreground: 'white',
	background: 'black'
}

let output = ''

function setupCanvas() {
	canvas.width = 1
	canvas.height = 1
}

function clearCanvas() {
	ctx.fillStyle = colors.background
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function prepareFont(font, size, bold) {
	ctx.font = bold ? `bold ${size}px "${font}"` : `${size}px "${font}"`
	ctx.fillStyle = colors.foreground
}

function prepareCanvas(width, height) {
	canvas.width = width
	canvas.height = height
	clearCanvas()
}

function getSumOfColumns(r, col, row) {
	let bits = []
	for (let i = 0; i < col; i++) {
		let bit = 0
		for (let j = 0; j < row; j++) bit += r[j * col + i] ? Math.pow(2, j) : 0
		bits.push(bit)
	}
	return bits
}

function render() {
	const boldFonts = document.getElementById('rA').checked
	const boundingBoxes = document.getElementById('rB').checked
	document.getElementById('previewElm').setAttribute('data-boxes', boundingBoxes ? true : false)

	setupCanvas()
	clearCanvas()

	const font = document.querySelector('#fontFamily').value || 'Consolas'
	const size = document.querySelector('#size').value
	const crop = Number(document.querySelector('#crop').value)
	const y = Number(document.querySelector('#offset').value)
	const glyphs = document.querySelector('#glyphs').value
	const threshold = Number(document.querySelector('#threshold').value)
	prepareFont(font, size, boldFonts)

	const width = Math.floor(ctx.measureText('A').width) + crop
	const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(glyphs)
	const height = Math.round(actualBoundingBoxAscent + actualBoundingBoxDescent)
	let lookup = []
	let fontData = []

	if (width < 0 || height < 0) return false

	prepareCanvas(width, height)
	ctx.translate(0, 0)

	for (let i = 0, n = glyphs.length; i < n; i++) {
		const glyph = glyphs[i]
		clearCanvas()
		prepareFont(font, size, boldFonts)
		ctx.fillText(glyph, crop * 0.5, height + y)
		try {
			const red = []
			const full = ctx.getImageData(0, 0, width, height)
			for (let x = 0, n = full.data.length; x < n; x += 4) {
				const bit = full.data[x] >= threshold ? 255 : 0
				full.data[x] = bit
				full.data[x + 1] = bit
				full.data[x + 2] = bit
				red.push(bit)
			}
			ctx.putImageData(full, 0, 0)
			document.getElementById('__g' + i).src = ctx.canvas.toDataURL()

			fontData.push.apply(fontData, getSumOfColumns(red, width, height))
			lookup.push(glyph)
		} catch (error) {
			console.error(error)
			return false
		}
	}

	const fontName = font.toLowerCase().replace(/\s/g, '_') + '_' + size + 'px'
	const fontObj = {
		name: fontName,
		monospace: true,
		width,
		height,
		fontData,
		lookup,
		config: {
			threshold,
			crop,
			y
		}
	}

	fileName = `font.${fontObj.name}.js`
	const prettify = document.getElementById('rC').checked
	const conjunction = 'export default'
	let dataCode
	if (prettify) {
		const indent = (str, n) =>
			str
				.split('\n')
				.map(l => `${' '.repeat(n)}${l}`)
				.join('\n')

		const lookupStr = JSON.stringify(lookup)
		const fontDataStr = JSON.stringify(fontData).slice(1, -1)
		const regex = new RegExp(`(([^,]*,){${width}})`, 'gm')
		const unlabeledData = '\n' + fontDataStr.replace(regex, '$1\n')
		const labeledData = unlabeledData
			.split('\n')
			.map((l, i) => (i === 0 ? l : `/* === ${lookup[i - 1] || ''} === */ ${l}`))
			.join('\n')

		const fontDataPretty = labeledData.trimStart()
		const lookupPretty =
			' ' +
			lookupStr
				.replaceAll('","', "', '")
				.replace(/\'\'\'/, '"\'"')
				.replace('["', "'")
				.replace('"]', "'")
				.replace(/(([^,]*,){10})/gm, '$1\n')

		const i2x = '  '
		const i4x = 4
		const i4xs = ' '.repeat(i4x)
		dataCode =
			`{\n${i2x}name: "${fontName}",\n${i2x}monospace: true,\n` +
			`${i2x}width: ${width},\n${i2x}height: ${height},\n${i2x}fontData: [\n${indent(
				fontDataPretty,
				i4x
			)}\n${i2x}],\n` +
			`${i2x}lookup: [\n${indent(lookupPretty, i4x)}\n${i2x}],\n` +
			`${i2x}config: {\n${i4xs}threshold: ${threshold},\n${i4xs}crop: ${crop},\n${i4xs}y: ${y}\n${i2x}}\n}`
	} else {
		dataCode = JSON.stringify(fontObj)
	}

	const separator = '='.repeat(fileName.length + 8)
	const metadata = `/* ${separator}
   === ${fileName} ===
   Font name: ${font}
   Font size: ${size}px
   ${separator}
 */\n\n// prettier-ignore\n`
	output = `${metadata}${conjunction} ${dataCode}`
	document.getElementById('code').value = `${metadata}${conjunction} ${dataCode}`
}
