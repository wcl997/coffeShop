<template>
    <div class="bg">
        <div class="background"></div>
        <div class="bg_contxt">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import '../assets/less/bg.less'
    export default {
        name:'Bg'
    }
</script>
