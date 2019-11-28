<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="资产变更" name="register">
          <el-row>
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
            <el-table-column align="center" prop="name" label="资产名称" ></el-table-column>
            <el-table-column prop="classesName" label="资产类别" ></el-table-column>
            <el-table-column prop="specification" label="品牌型号" ></el-table-column>
            <el-table-column prop="life" label="预计使用年限" ></el-table-column>
            <el-table-column align="center" prop="source" label="资产来源"></el-table-column>
            <el-table-column align="center" prop="money" label="单价">
              <template slot-scope="scope">{{scope.row.money|currency}}</template>
            </el-table-column>
            <el-table-column prop="purchaseTime" label="购买时间">
              <template slot-scope="scope">{{scope.row.purchaseTime|date}}</template>
            </el-table-column>
            <el-table-column prop="accountingDate" label="财务记账日期" >
              <template slot-scope="scope">{{scope.row.accountingDate|date}}</template>
            </el-table-column>
            <el-table-column prop="accountingNo" label="财务记账凭证号" ></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="editRegister(scope.row)" type="text" :size="$store.state.size">修改</el-button>
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
                      <el-form-item label="资产类别" prop="classesId">
                        <el-input
                          v-model="addRegisterData.classesName"
                          placeholder="资产名称"
                          disabled="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="所属部门" prop="organId">
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
        <el-button v-if="!showModel" type="primary" @click="doEdit">确 定</el-button>
        <el-button @click="addDialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import daBreadcrumb from "@/components/da-breadcrumb";
import daAssetsStatus from "@/components/da-assets-status";
import classesSelect from "../Classes/classesSelect";
import organSelect from "../sys/OrganSelect";
import { isDecimal,isInteger } from "@/libs/validator.js";
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
        money: [{ required: true},{ validator: isDecimal }],
        purchaseTime: [{ required: true, message: "请输入" }],
        organId: [{ required: true, message: "请选择" }],
        life: [{ required: true, message: "请输入" },{ validator: isInteger }],
        source: [{ required: true, message: "请选择" }],
        specification: [{ required: true, message: "请输入" }],
        accountingDate: [{ required: true, message: "请输入" }],
        accountingNo: [{ required: true, message: "请输入" }]
      },
      activeName: "register",
      searchAssetName: "",
      addDialogTableVisible: false,
      editDialogTableVisible: false,
      showModel: false,
      addRegisterData: {},
      selectedRows: [],
      registerData: [],
      pageSize: 10,
      currentPage: 1,
      totalSize: 0
    };
  },
  methods: {
    doEdit() {
      //addRegisterData 要添加的资产数据

      this.$refs["form"].validate(valid => {
        if (valid) {
          let _self = this;
          _self.addDialogTableVisible = false;
          delete _self.addRegisterData.registerUser;
          delete _self.addRegisterData.classes;
          delete _self.addRegisterData.registerTime;
          delete _self.addRegisterData.usingTime;
          if(!_self.addRegisterData.expiryTime){
            delete _self.addRegisterData.expiryTime;
          }
          this.$api.post("/asset/save", _self.addRegisterData).then(res => {
            _self.addRegisterData = {};
            _self.$message({
              type: "success",
              message: "修改成功!"
            });
            _self.addDialogTableVisible = false;
            _self.load();
          });
        }
      });
    },
    editRegister(row) {
      this.showModel = false;
      this.addRegisterData = row;
      this.addDialogTableVisible = true;
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
    print() {
      let _self = this;
      let pLength = _self.selectedRows.length;
      if (pLength == 0) {
        this.$message({
          type: "error",
          message: "请先选择需要打印的资产信息!"
        });
        return;
      }

      let head_str = "<html><head><title>资产标签打印</title></head>"; //先生成头部
      head_str +=
        "<style media='print'>" +
        "@page {               " +
        "  size: auto;         " +
        "     margin: 0mm;     " +
        "   }                  ";

      head_str += "</style><body>";
      let foot_str = "</body></html>"; //生成尾部

      let printContent = "";
      for (let i = 0; i < pLength; i++) {
        printContent +=
          "<table style='margin:15px;page-break-after:always;'><tr >";
        printContent +=
          "<td style='padding:10px'>" + "<div id='XQ" + i + "'></div>";
        printContent += "</td>";
        printContent += "<td>";
        printContent +=
          "<label style='display:block'>资产名称：" +
          _self.selectedRows[i].name +
          "</label>";
        printContent +=
          "<label style='display:block;margin-top:10px'>资产类型：" +
          _self.selectedRows[i].classes.name +
          "</label>";
        printContent +=
          "<label style='display:block;margin-top:10px'>登记部门：" +
          _self.selectedRows[i].organName +
          "</label>";
        printContent += "</td></tr>";
        printContent += "</table>";
      }
      let oldStr = document.body.innerHTML;
      //构建新网页(关键步骤,必须先构建新网页,在生成二维码,否则不能显示二维码)
      document.body.innerHTML = head_str + printContent + foot_str;
      for (let j = 0; j < _self.selectedRows.length; j++) {
        document.getElementById("XQ" + j).innerHTML = ""; //置空
        let contentStr = _self.selectedRows[j].code; //二维码内容
        let qrcode = new QRCode(document.getElementById("XQ" + j), {
          text: contentStr,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff"
        });
      }
      window.print(); //打印刚才新建的网页
      document.body.innerHTML = oldStr;
      window.location.reload();
      return false;
    },
    load() {
      let _self = this;
      this.$api
        .get("/asset/list", {
          status:0,
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

