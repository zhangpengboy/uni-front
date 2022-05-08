<template>
	<web-view :webview-styles="webviewStyles" :src="webUrl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				webUrl: null
			}
		},
		onLoad(option) {
			this.webUrl = decodeURIComponent(option.webUrl)
		},
	}
</script>

<style>
</style>
