obj = [1,2,3,4,5]
console.log(obj);
// obj.splice((2-1),1);
// console.log(obj);
console.log("-----------------")
deleteId = 4;

for (var i=0; i<obj.length; i++){
    
    console.log(obj[i])


    if (deleteId === obj[i]){
      obj.splice(deleteId,1);
      return obj    
      
    } else{
      console.log("index " + [i] + " does not equal deleteId = " + deleteId)
    }
    
  }

  console.log("obj is now: " + obj)