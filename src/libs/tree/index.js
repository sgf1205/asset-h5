export default {
    toTreeData(data, attr) {
        let tree = [];
        let resData = data;
        for (let i = 0; i < resData.length; i++) {
            if(!resData[i][attr.parendId] && resData[i].id!=attr.rootId){
                resData[i][attr.parendId]=0
            }
            if (resData[i][attr.id] === attr.rootId) {
                let obj = {
                    id: resData[i][attr.id],
                    name: resData[i][attr.name]
                    //children: []
                };
                tree.push(obj);
                resData.splice(i, 1);
                i--;
            }
        }
        if(tree.length == 0 ){ //没有根节点
            for (let i = 0; i < resData.length; i++) {
                if(resData[i][attr.parendId]==0){
                    let obj = {
                        id: resData[i][attr.id],
                        name: resData[i][attr.name]
                    };
                    tree.push(obj);
                    resData.splice(i, 1);
                    i--;
                }
            }
        }
        var run = function (treeArrs) {
            if (resData.length > 0) {
                    for (let i = 0; i < treeArrs.length; i++) {//有根节点
                        for (let j = 0; j < resData.length; j++) {
                            if (treeArrs[i].id === resData[j][attr.parendId]) {
                                let obj = {
                                    id: resData[j][attr.id],
                                    name: resData[j][attr.name],
                                    //children: []
                                };
                                if(!treeArrs[i].children){
                                    treeArrs[i].children=[];
    
                                }
                                treeArrs[i].children.push(obj);
                                
                                resData.splice(j, 1);
                                j--;
                            }
                        }
                        run(treeArrs[i].children);
                    }
            }
        };
        run(tree);
        return tree;
    }
}