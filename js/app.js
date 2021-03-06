new Vue({
    el: '#app',
    data: function(){
        return {
            weight: null,//实重
            length: null,//长
            width: null,//宽
            height: null,//高
            isIrregular: false,//是否不规则形状
        
            firstWeightPrice: null,//首重单价
            continuedWeightPrices: null,//续重单价
        
            finalWeight: null,//最终重量
            finalFormatWeight: null,//最终计算重量
            finalSurcharge: null,//最终附加费
            finalPrice: null,//最终价格
        }
    },
    created: function () {
        
    },
    computed: {
        //体积
        volume: function(){
            return math.evaluate(`${this.length} * ${this.width} * ${this.height}`)
        },
        //体积重 长x宽x高/6000
        volumeWeight: function(){
            return math.evaluate(`${this.volume} / 6000`)
        },
    },
    methods: {
        onSubmit: function(){
            this.finalWeight = this.getFinalWeight()
            this.finalFormatWeight = this.formatWeight()
            this.finalSurcharge = this.getFinalSurcharge()
            
            this.finalPrice = this.getFinalPrice()
        },
        onReset : function(){
            Object.assign(this.$data, this.$options.data())
        },
        sortLengthArray: function(){
            return [this.length,this.width,this.height].sort((a,b)=>b-a)
        },
        //获取最终重量
        getFinalWeight: function(){
            if(this.weight >= this.volumeWeight){//实重大于等于体积重
                return this.weight
            }else if(math.evaluate(`${this.volumeWeight} - ${this.weight}`) > 10){//体积重-实重大于10
                return math.evaluate(`${this.volume} / 12000`)
            }else{//体积重大于实重
                if(this.weight <= 4.5){//实重小于等于4.5
                    if(math.evaluate(`${this.volumeWeight} / ${this.weight}`) <= 2){
                        return this.weight
                    }else{
                        return math.evaluate(`${this.volume} / 8000`)
                    }
                }else{//实重大于4.5
                    return Math.max(math.evaluate(`${this.volume} / 8000`),this.weight)
                }
            }
        },
        //格式化重量 确保重量末尾没有小数，或者存在一位小数且值为5
        formatWeight: function () {
            const jin = math.evaluate(`${this.finalWeight} * 2`)
            
            return math.evaluate(`${Math.ceil(jin)} / 2`)
        },
        //获取最终附加费
        getFinalSurcharge: function(){
            const lengthArray = this.sortLengthArray()
            const maxLength = lengthArray[0]
            const secondLength = lengthArray[1]
            const thirdLength = lengthArray[2]

            let price = 0

            if(maxLength > 240){
                price += 700
            }else if(maxLength > 150){
                price += 150
            }else if(maxLength > 120){
                price += 100
            }

            if(secondLength > 75){
                price += 100
            }

            if(math.evaluate(`${maxLength} + (${secondLength} + ${thirdLength}) * 2`) > 330){
                price += 150
            }

            if(this.isIrregular){
                price += 100
            }

            if(this.weight > 23){
                price += 150
            }

            return price
        },
        //获取最终总价格
        getFinalPrice: function(){
            const {finalFormatWeight, firstWeightPrice, continuedWeightPrices, finalSurcharge} = this
            // const weightPrice = 0.5 * firstWeightPrice * 2 + (finalFormatWeight - 0.5) * continuedWeightPrices * 2
            const weightPrice = math.evaluate(`0.5 * ${firstWeightPrice} * 2 + (${finalFormatWeight} - 0.5) * ${continuedWeightPrices} * 2`)
            
            return math.evaluate(` ${weightPrice} + ${finalSurcharge}`)
        },
        onRequired: function(val){
            return val && val > 0 || '请输出对应项'
        },
        onInput: function(value){
            const a = value.match(/^\d*(\.?\d{0,1})/g)[0]
            return a
        }
    }
})