<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="资产登记" name="register">
          <el-row>
            <el-col :span="18">
              <el-button
                type="primary"
                :size="$store.state.size"
                @click="addDialogTableVisible=true;showModel=false;addRegisterData={}"
                icon="el-icon-plus"
              >新增</el-button>
              <el-button
                type="danger"
                :size="$store.state.size"
                @click="delRegister"
                icon="el-icon-delete"
              >删除</el-button>
              <el-button
                type="primary"
                :size="$store.state.size"
                @click="print"
                icon="el-icon-print"
              >打印资产标签</el-button>
              <el-dropdown
                split-button
                type="primary"
                :size="$store.state.size"
                style="margin-left:10px;"
                @command="handleCommand"
              >
                <i class="el-icon-daochu"></i> 导入/导出
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="download">下载导入模板</el-dropdown-item>
                  <el-dropdown-item command="import">批量导入资产</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <el-input
                placeholder="请输入资产名称"
                v-model="searchAssetName"
                class="input-with-select"
                :size="$store.state.size"
              >
                <el-button slot="append" icon="el-icon-search" @click="load"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table
            :data="registerData"
            border
            style="width: 100%;margin:10px 0;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="status" label="资产状态" width="80">
              <template slot-scope="scope">
                <da-assets-status :status="scope.row.status"></da-assets-status>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="资产名称" width="200"></el-table-column>
            <el-table-column prop="classesName" label="资产类别" width="150"></el-table-column>
            <el-table-column prop="specification" label="品牌型号" width="100"></el-table-column>
            <el-table-column prop="life" label="预计使用年限" width="120"></el-table-column>
            <el-table-column align="center" prop="source" label="资产来源" width="80"></el-table-column>
            <el-table-column align="center" prop="money" label="单价" width="80">
              <template slot-scope="scope">{{scope.row.money|currency}}</template>
            </el-table-column>
            <el-table-column prop="purchaseTime" label="购买时间" width="120">
              <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
            </el-table-column>
            <el-table-column prop="accountingDate" label="财务记账日期" width="120">
              <template slot-scope="scope">{{scope.row.accountingDate|date}}</template>
            </el-table-column>
            <el-table-column prop="accountingNo" label="财务记账凭证号" width="120"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="showRegister(scope.row)" type="text" :size="$store.state.size">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="[5,10, 20, 30, 50]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="totalSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 资产登记 弹窗 -->
    <el-dialog title="资产登记" width="70%" :visible.sync="addDialogTableVisible">
      <el-form ref="form" :model="addRegisterData" label-width="80px" :rules="rules">
        <el-tabs tab-position="left">
          <el-tab-pane label="基本信息">
            <el-row>
              <template>
                <slot v-if="showModel">
                  <el-col :span="8" align="center" style="height:180px">
                    <div id="qrcode"></div>
                  </el-col>
                  <el-col :span="16">
                    <el-col :span="16">
                      <el-form-item label="资产名称" prop="name">
                        <el-input v-model="addRegisterData.name" placeholder="资产名称" disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="资产类型" prop="classesId">
                        <el-input
                          v-model="addRegisterData.classesName"
                          placeholder="资产名称"
                          disabled="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="登记部门" prop="organId">
                        <el-input
                          v-model="addRegisterData.organName"
                          placeholder="资产名称"
                          disabled="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </slot>
                <slot v-else>
                  <el-col :span="8">
                    <el-form-item label="资产名称" prop="name">
                      <el-input v-model="addRegisterData.name" placeholder="资产名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产类别" prop="classesId">
                      <classes-select v-model="addRegisterData.classesId"></classes-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属部门" prop="organId">
                      <organ-select :organId="addRegisterData.organId" @changeId="changeOrganId"></organ-select>
                    </el-form-item>
                  </el-col>
                </slot>
              </template>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="品牌型号" prop="specification">
                  <el-input v-model="addRegisterData.specification" placeholder="品牌型号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="SN号">
                  <el-input v-model="addRegisterData.sn" placeholder="SN号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计量单位">
                  <el-input v-model="addRegisterData.metering" placeholder="计量单位"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单价" prop="money">
                  <el-input v-model="addRegisterData.money" placeholder="单价"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="购置时间" prop="purchaseTime">
                  <el-date-picker
                    v-model="addRegisterData.purchaseTime"
                    type="date"
                    style="width:100%;"
                    placeholder="购置时间"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预计使用年限" prop="life" label-width="110px">
                  <el-input v-model="addRegisterData.life" placeholder="预计使用年限"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产来源" prop="source">
                  <el-input v-model="addRegisterData.source" placeholder="资产来源"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="财务记账日期" prop="accountingDate" label-width="120px">
                  <el-date-picker
                    v-model="addRegisterData.accountingDate"
                    type="date"
                    style="width:100%;"
                    placeholder="财务记账日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="财务记账凭证号" prop="accountingNo" label-width="120px">
                  <el-input v-model="addRegisterData.accountingNo" placeholder="财务记账凭证号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="addRegisterData.remark" placeholder="备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="维保信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="供应商">
                  <el-input v-model="addRegisterData.supplier" placeholder="供应商名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人">
                  <el-input v-model="addRegisterData.contacts" placeholder="联系人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系方式">
                  <el-input v-model="addRegisterData.tell" placeholder="联系方式"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维保到期">
                  <el-date-picker
                    v-model="addRegisterData.expiryTime"
                    type="date"
                    style="width:100%;"
                    placeholder="维保到期时间"
                    format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="维保说明">
                  <el-input type="textarea" v-model="addRegisterData.explain" placeholder="维保说明"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!showModel" type="primary" @click="addRegister">确 定</el-button>
        <el-button @click="addDialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入EXCEL弹框-->
    <el-dialog title="资产导入" width="300px" style="overflow:auto" :visible.sync="assetUploadVisible">
        <el-upload
            :on-success="uploadSuccess"
            :headers="uploadHeaders"
            accept=".xls"
            ref="upload"
            height="100px"
            :action="uploadUrl"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" :size="$store.state.size" type="primary">选取文件</el-button>
  
            <el-button style="margin-left: 10px;" :size="$store.state.size" type="success" @click="submitUpload"
                      :disabled="buttonDisabled">上传
            </el-button>
        </el-upload>
        <div v-if="importResult" style="margin-top:10px;color:red">
            导入成功：{{importResult.success}}条，导入失败：{{importResult.fail}}条
            <el-button v-if="importResult.fail>0" :size="$store.state.size" :plain="true" @click="downloadError">下载失败结果</el-button>
        </div>
    
    </el-dialog>

    <div style="visibility:hidden" ref="printDiv">
      <table v-for="(obj,idx) in printList" v-bind:key="idx"  style='page-break-after:always;margin:2mm'>
        <Tr>
          <td><div :id='"XQ"+idx'></div></td>
          <td>
            <label style='display:block;font-size:8pt'>{{obj.name}}</label>
            <label style='display:block;font-size:8pt'>{{obj.classesName}}</label>
            <label style='display:block;font-size:8pt'>{{obj.organName}}</label>
          </td>
        </Tr>
      </table>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import daBreadcrumb from "@/components/da-breadcrumb";
import daAssetsStatus from "@/components/da-assets-status";
import classesSelect from "../Classes/classesSelect";
import organSelect from "../sys/OrganSelect";
import { isDecimal, isInteger } from "@/libs/validator.js";
export default {
  components: {
    "classes-select": classesSelect,
    "organ-select": organSelect,
    daBreadcrumb,
    daAssetsStatus
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入" }],
        classesId: [{ required: true, message: "请选择" }],
        money: [{ required: true }, { validator: isDecimal }],
        purchaseTime: [{ required: true, message: "请输入" }],
        organId: [{ required: true, message: "请选择" }],
        life: [{ required: true, message: "请输入" }, { validator: isInteger }],
        source: [{ required: true, message: "请选择" }],
        specification: [{ required: true, message: "请输入" }],
        accountingDate: [{ required: true, message: "请输入" }],
        accountingNo: [{ required: true, message: "请输入" }]
      },
      activeName: "register",
      searchAssetName: "",
      addDialogTableVisible: false,
      editDialogTableVisible: false,
      assetUploadVisible: false,
      buttonDisabled:false,
      uploadUrl:this.$api.apiHost + '/api/asset/import',
      uploadHeaders:{'token': sessionStorage.token},
      importResult:false,
      showModel: false,
      addRegisterData: {},
      selectedRows: [],
      registerData: [],
      fileList: [],
      printList:[],
      pageSize: 10,
      currentPage: 1,
      totalSize: 0
    };
  },
  methods: {
    addRegister() {
      //addRegisterData 要添加的资产数据

      this.$refs["form"].validate(valid => {
        if (valid) {
          let _self = this;
          this.addDialogTableVisible = false;

          this.$api.post("/asset/save", _self.addRegisterData).then(res => {
            _self.addRegisterData = {};
            _self.$message({
              type: "success",
              message: "添加成功!"
            });
            _self.addDialogTableVisible = false;
            _self.load();
          });
        }
      });
    },
    showRegister(row) {
      this.showModel = true;
      this.addRegisterData = row;
      this.addDialogTableVisible = true;
      this.$nextTick(function() {
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode("qrcode", {
          width: 150,
          height: 150,
          text: row.code, // 二维码地址
          colorDark: "#000",
          colorLight: "#fff"
        });
      });
    },
    changeOrganId(organId) {
      this.addRegisterData.organId = organId;
    },
    delRegister() {
      let _self = this;
      if (this.selectedRows.length == 0) {
        this.$message("请选中要删除的数据条目！");
        return;
      }
      let delRegisterIds = this.selectedRows.map(r => r.id);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "资产删除确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //要删除的ID数组 this.delRegisterIds
          _self.$api
            .post("/asset/delete", { ids: delRegisterIds })
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _self.load();
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
            });
        })
        .catch(error => {
          console.log(error);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      //获取选中的删除条目ID
      //console.log(val)
      this.selectedRows = val;
    },
    handleCommand(command) {
      if (command == "download") {
        this.openFullScreen('下载中，请稍后');
        this.$api.download("/asset/downloadTemplate").then(res => {
          const content = res;
          const blob = new Blob([content]);
          const fileName = "资产导入模板.xls"; //导出文件名称自定义
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        });
      } else if ((command = "import")) {
        this.fileList=[];
        this.buttonDisabled = false;
        this.importResult=undefined;
        this.assetUploadVisible = true;
      }
    },
    print(){
      this.printList=this.selectedRows;

      this.$nextTick(() => {
        for (let j = 0; j < this.printList.length; j++) {
          document.getElementById("XQ" + j).innerHTML = ""; //置空
          let contentStr = this.selectedRows[j].code; //二维码内容
          let qrcode = new QRCode(document.getElementById("XQ" + j), {
            text: contentStr,
            width: 75,
            height: 75,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
        let _this=this;
        setTimeout(function() {
            let mWindow = window.open('', 'PRINT');
            mWindow.document.write('<html><head><title></title></head>');
            mWindow.document.write('<style media="print">');
            //mWindow.document.write('@media print {width:40mm;height:30mm;font-size:1pt;}');
            //mWindow.document.write('@page :left{margin-left:2mm}');
           // mWindow.document.write('@page :right{margin-left:2mm}');
            mWindow.document.write('nav,aside{display:none}');
            mWindow.document.write('@page {size: 40mm 30mm;margin: 0mm;}');
            mWindow.document.write('</style><body>');
            mWindow.document.write(_this.$refs.printDiv.innerHTML);
            mWindow.document.write('</body></html>');
            mWindow.document.close(); // necessary for IE >= 10
            mWindow.focus(); // necessary for IE >= 10*/
            mWindow.print();
            mWindow.close();
            _this.$refs.printDiv.innerHTML='';
        },1000)
       
      })
      
    },
    load() {
      let _self = this;
      this.$api
        .get("/asset/list", {
          status: 0,
          name: this.searchAssetName,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        })
        .then(res => {
          if (res.code == 0 && res.data) {
            _self.registerData = res.data.result;
            //_self.currentPage=res.data.currentPage;
            _self.totalSize = res.data.totalSize;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.load();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.load();
    },
    submitUpload(){
      this.$refs.upload.submit()
      this.buttonDisabled = true
    },
    uploadSuccess(res) {
      this.importResult=res.data;
      this.$message({
        type: "success",
        message: "导入成功!"
      });
      this.load();
    },
    downloadError(){
      this.openFullScreen('下载中，请稍后');
      this.$api.download("/asset/downloadError").then(res => {
          const content = res;
          const blob = new Blob([content]);
          const fileName = "资产导入错误记录.xls"; //导出文件名称自定义
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        });
    },
    openFullScreen(title) {
        let loading = this.$loading({
          lock: true,
          text: title,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="less">
.assets-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100px;
    display: block;
  }
}
.show-dialog {
  .el-input input,
  .el-textarea textarea {
    background-color: #fff !important;
    color: #606266 !important;
    cursor: default !important;
  }
}
</style>

