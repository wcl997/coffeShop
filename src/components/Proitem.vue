<template>
    <div class="proitem">
        <div class="pro_img">
            <img class="auto-img" :src="product.small_img" alt="">
        </div>
        <div class="pro_info">
            <div class="pro_top">
                <div class="pro_name">
                    <div class="p_name">{{product.name}}</div>
                    <div class="p_rule">{{product.rule}}</div>
                </div>
                <div class="p_enname">{{product.enname}}</div>
            </div>
            <div class="pro_bottom">
                <div class="p_price">&yen;{{product.price}}</div>
                <div class="p_count">x{{product.count}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/proitem.less'
    export default {
        name:'Proitem',
        props:{
            product:{
                type:Object,
                default(){
                    return {}
                }
            }
        }
    }
</script>