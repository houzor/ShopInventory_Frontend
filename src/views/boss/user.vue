<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" placeholder="请输入用户名"></el-input>
          <el-input v-model="searchModel.phone" placeholder="请输入电话"></el-input>
          <el-button @click="getUserList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" circle icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格 -->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="180">
        </el-table-column>
        <el-table-column prop="id" label="用户ID" width="180">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role" label="用户类型" width="180">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.role == 1" type="success">老板</el-tag>
            <el-tag v-else type="danger">员工</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="电子邮件">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- 这里要用作用域插槽，获取当前作用域的行的数据 -->
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id, scope.row.username)" type="primary" size="mini">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 用户信息编辑对话框，可重用的对话框-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="userform" ref="userformRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="userform.id == null || userform.id == undefined" label="密码" prop="password"
          :label-width="formLabelWidth">
          <el-input type="password" v-model="userform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="userform.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="role" :label-width="formLabelWidth">
          <el-radio v-model="userform.role" :label="1">老板</el-radio>
          <el-radio v-model="userform.role" :label="0">员工</el-radio>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar" :label-width="formLabelWidth">
          <el-input v-model="userform.avatar" autocomplete="off" placeholder="（请填写图床链接：如七牛云链接，没有可不填）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '../../api/userManage.js'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        return callback(new Error('手机号码格式错误'));
      }
      callback();
    };
    var checkEmail = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'));
      }
      callback();
    };
    // 验证器，blur和按下按钮都会触发
    var checkUserName = (rule, value, callback) => {
      console.log("我执行到检查username了")
      //两者判断这个框的逻辑是不一样的，添加用户直接查
      if (this.title == "添加用户") {
        userApi.judgeUserName(value).then(res => {
          if (!res.data) {
            return callback();
          }
          else {
            return callback(new Error('用户名已存在'));
          }
        })
      }
      else if (this.title == "修改用户") {
        console.log("我执行到修改用户了")
        if (value != this.tempname) {
          console.log(value + " " + this.tempname)
          userApi.judgeUserName(value).then(res => {
            if (!res.data) {
              return callback();
            }
            else {
              return callback(new Error('用户名已存在'));
            }
          })
        }
        else {
          return callback();
        }
      }
    }
    return {
      formLabelWidth: '130px',
      userform: {

      },
      //临时变量，用于列表某一行的用户名，以便在修改用户的时候判断是否修改了用户名
      tempname: '',
      // 控制表单是否可见
      dialogFormVisible: false,
      //控制表单的标题
      title: "",
      //数据总数
      total: 0,
      //查询条件
      searchModel: {
        //分页默认值
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    deleteUser(user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUserById(user.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          });
          this.getUserList();
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //也要校验表单，通过validate对整个表单进行校验，校验通过后，调用后台接口，保存用户信息
    saveUser() {
      this.$refs['userformRef'].validate((valid) => {
        if (valid) {
          userApi.judgeCommit(this.userform).then(response => {
            //成功提示（element自带），关闭对话框，刷新表格
            this.$message({
              message: response.message,
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.getUserList();
          });
        } else {
          console.log('提交错误!!');
          return false;
        }
      })
    },
    clearForm() {
      this.userform = {};
      this.$refs['userformRef'].clearValidate();
    },
    openEditUI(id, username) {
      if (id == null) {
        this.title = '添加用户';
      } else {
        this.title = '修改用户';

        this.tempname = username;
        //根据id查询用户数据
        console.log(this.tempname + "我打开了修改的UI了")
        userApi.getUserById(id).then(response => {
          this.userform = response.data;
        })
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then(response => {
        this.userList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  // 页面加载时调用钩子函数
  created() {
    this.getUserList();
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-card {
  margin-bottom: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>