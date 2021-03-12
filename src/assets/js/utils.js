import {Toast} from 'vant';

class Utils{
    vaildForm(obj){
        for(let key in obj){
            if(!obj[key].reg.test(obj[key].value)){
                Toast({
                    message:obj[key].errorMsg,
                    duration:3000,
                    forbidClick:true
                });
                return false;
            }
        }

        return true
    }
}

export const utils = new Utils()