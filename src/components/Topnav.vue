<template>
    <div>
        <div class="topnav">
            <div class="topnav-title">
                <span>晚上好</span>
                <span>dddddddddddddd</span>
            </div>
            <van-search 
            v-model="topSvalue" 
            placeholder="请输入搜索关键词"
            shape="round"
            >
            </van-search>
        </div>
    </div>
</template>

<script>
    import '../assets/less/topnav.less'
    export default {
        name:'Topnav',
        data() {
            return {
                topSvalue:""
            }
        },
    }
</script>
