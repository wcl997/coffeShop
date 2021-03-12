<template>
    <div class="payitem">
        <div>
            <slot name='paytitle'>
                <div class="paytitle">订单信息</div>
            </slot>
        </div>
        <div class="paymiddle">
            <slot name="proitem"></slot>
        </div>
        <div class="payfoot">
            <div class="p-line">
                <div class="pay-left"></div>
                <div class="pay-right"></div>
            </div>

            <div class="footinfo">
                <div class="footdate" v-if="proInfo.date">{{proInfo.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                <div class="f_bottom">
                    <div class="f-count">共计 {{proInfo.count}} 件</div>
                    <div class="foot_total">合计&yen;{{proInfo.total}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/payitem.less'
    export default {
        name:'Payitem',
        props:{
            proInfo:{
                type:Object,
                default(){
                    return {
                        count:0,
                        total:0,
                        date:''
                    }
                }
            }
        },
    }
</script>
