<template>
    <div class="login">
        <RXnav />
        <div class="login-box">
            <div class="login-title-box">
                <div class="login-title">欢迎回来</div>
                <div class="login-title-english">Please login to your accounts</div>
            </div>

            <div class="login-info">
                <van-field 
                v-model="userLoginInfo.phone" 
                label="手机号" 
                placeholder="请输入手机号" />
                <van-field 
                v-model="userLoginInfo.password" 
                :type="isOpen?'text':'password'"
                :right-icon="isOpen?'eye-o':'closed-eye'"  
                label="密 码" 
                placeholder="请输入密码" @click-right-icon='closeEye'/>
            </div>

            <div class="forget">忘记密码</div>

            <div class="login-button">
                <van-button 
                round block color='#CD585E' 
                type="default"
                @click='verifyLogin'>登 录</van-button>
                <van-button 
                class="register"
                round block 
                type="default"
                @click='showRe'>注 册</van-button>
            </div>
        </div>

        <van-popup v-model="isShow" position="bottom" closeable>
            <div class="register-info">
                <div class="register-info-title">注册</div>
                <div class="form-box">
                <van-field 
                v-model="userRegisterInfo.phone" 
                label="手机号" 
                placeholder="请输入手机号(11位)" />

                <van-field 
                v-model="userRegisterInfo.password" :type="isOpen?'text':'password'" 
                label="密 码" 
                placeholder="请输入密码(6-16位)" :right-icon="isOpen?'eye-o':'closed-eye'" @click-right-icon='closeEye'/>

                <van-field 
                v-model="userRegisterInfo.nickname" 
                label="昵称" 
                placeholder="输入昵称(1-10位)" />

            </div>
                <div class="login-button">
                    <van-button 
                    class="register"
                    round 
                    block 
                    color="#CD585E" 
                    @click='closeRe'
                    >注 册</van-button>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script>
import '../assets/less/login.less'

import RXnav from '../components/RXnav.vue'
import {utils} from '../assets/js/utils'
import {mapMutations} from 'vuex'
export default {
    name:'Login',
    components:{
        RXnav
    },
    data() {
        return {
            //用户登录信息
            userLoginInfo:{
                phone:"",
                password:""
            },

            //用户注册信息
            userRegisterInfo:{
                phone:"",
                password:"",
                nickname:""
            },

            //是否显示弹出层
            isShow:false,
            //是否显示密码
            isOpen:true
        }
    },
    created(){
        this.changeShopcarCount(0);
        this.changeshopSign(false);
    },
    methods: {
        ...mapMutations(['changeShopcarCount','changeshopSign']),
        // 显示注册
        showRe(){
            this.isShow=true
        },
        closeRe(){
            let obj = {
                phone:{
                    value:this.userRegisterInfo.phone,
                    reg:/^1[3-9]\d{9}$/,
                    errorMsg:'手机号格式不正确'
                },
                password:{
                    value:this.userRegisterInfo.password,
                    reg:/^[A-Za-z]\w{5,15}$/,
                    errorMsg:'密码支持字母数字_组合且首字符必须为字母'
                },
                nickname:{
                    value:this.userRegisterInfo.nickname,
                    reg:/^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
                    errorMsg:'昵称支持汉字字母数字组合'
                },
            };
            
            //验证表单
            //表单验证不通过,拦截注册请求
            if(!utils.vaildForm(obj)){
                return
            }

            this.$toast.loading({
                duration:3000,
                forbidClick:true,
                message:'加载中...'
            })

            this.axios({
                method: 'POST',
                url:'/register',
                data:{
                    appkey:'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
                    nickname:this.userRegisterInfo.nickname,
                    password:this.userRegisterInfo.password,
                    phone:this.userRegisterInfo.phone
                }
            }).then(da=>{
                console.log(da)
                if(da.data.code == 100){
                    //关闭弹窗
                    this.isShow = false;
                    //清楚用户注册信息
                    for(let key in this.userRegisterInfo){
                        this.userRegisterInfo[key]=""
                    }
                }else{
                    this.$toast({
                        message:da.data.msg,
                        duration:3000,
                        forbidClick:true
                    })
                }
            }).catch(err=>{
                this.$toast.clear()
                console.log(err)
            })
        },
        closeEye(){
            this.isOpen=!this.isOpen
        },
        verifyLogin(){
            let obj = {
                phone:{
                    value:this.userLoginInfo.phone,
                    reg:/^1[3-9]\d{9}$/,
                    errorMsg:'手机号格式不正确'
                },
                password:{
                    value:this.userLoginInfo.password,
                    reg:/^[A-Za-z]\w{5,15}$/,
                    errorMsg:'密码支持字母数字_组合且首字符必须为字母'
                },
            };

            //验证表单
            //表单验证不通过,拦截注册请求
            if(!utils.vaildForm(obj)){
                return
            }

            this.$toast.loading({
                duration:3000,
                forbidClick:true,
                message:'加载中...'
            })

            this.axios({
                method: 'POST',
                url:'/login',
                data:{
                    appkey:this.appkey,
                    password:this.userLoginInfo.password,
                    phone:this.userLoginInfo.phone
                }
            }).then(da=>{
                console.log(da)

                if(da.data.code === 200){
                    this.$cookies.set('tokenString',da.data.token,'1d')

                    //跳转页面
                    this.$router.push({name:'Home'})
                }else{
                    this.$toast({
                        message:da.data.msg,
                        duration:3000,
                        forbidClick:true
                    })
                }
            }).catch(err=>{
                this.$toast.clear()
                console.log(err)
            })
        }
    },
}
</script>
