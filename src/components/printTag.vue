<template>
     <div class="print_container">
        <table style="width: 100%;">
            <tr>
                <td rowspan="2">
                    <vue-qr 
                                    :size="150"
                                    :margin="0"
                                    :auto-color="true"
                                    :dot-scale="1"
                                    :text="addRegisterData.code" />

                </td>
                <td>资产名称：{{value.name}}</td>
            </tr>
            <tr>
                <td>资产类型{{value.classes.name}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
import VueQr from 'vue-qr';
export default {
    name:'printTag',
    props: ['value'],
    components:{
        VueQr
    },
    data(){
        return {
           
        }
    },
    
}
</script>



