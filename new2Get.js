const arr = [];
async function Run() {
  let fileContent = '';

  try {
    const response = await fetch('newQ.txt');
    fileContent = await response.text();

    const regexQuestion = /^\d+\.\s+(.*?)\s*$/gm;
    const regexOptions = /[A-D]\)\s+(.*)$/gm;

    const lines = fileContent.split('\n');
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];
      const matchesQuestion = regexQuestion.exec(text);

      if (matchesQuestion) {
        if (currentQuestion) {
          arr.push(currentQuestion);
        }
        currentQuestion = { ques: matchesQuestion[1], options: [] };
      } else {
        const match = regexOptions.exec(text);
        if (match) {
          currentQuestion.options.push(match[1]);
        }
      }
      regexOptions.lastIndex = 0;
    }
    if (currentQuestion) {
      arr.push(currentQuestion);
    }

    // Assign answers to each question
    const answers = fileContent.match(/\d+$/gm);
    if (answers && answers.length === arr.length) {
      arr.forEach((question, index) => {
        question.answ = answers[index];
        question.answshow = `答案是${answers[index]}`;
      });
    } else {
      console.error('Failed to retrieve answers for all questions.');
    }

    let question = document.querySelector(".question")
    let choses = document.querySelectorAll(".choses li")
    let chosetext = document.querySelectorAll(".chosetext")
    let chosepoint = document.querySelectorAll("input")
    let lastbtn = document.querySelector(".lastbtn")
    let nextbtn = document.querySelector(".nextbtn")
    let answer = document.querySelector(".answer")
    let page = document.querySelector(".page")
    let catalo = document.querySelector(".catalo")
    let clean = document.querySelector(".clean")
    //题目和答案的数组在另一个文件里给出

    //保存做题进度
    //新建一个数组，长度和arr相等，做过为1，没做过为0
    let arr2 = []
    for (let i = 0; i < arr.length; i++) {
      arr2[i] = 0
    }
    // localStorage.setItem("arr2", JSON.stringify(arr2))
    //如果不加这一行，从菜单进入的时候会报错

    //在监听选项的时候，一旦出现点击事件
    //就把这个数组的index号位置设置为1
    //然后把这个数组存入本地
    //在渲染的时候，引入这个数组，如果index位置为1
    //就显示出答案部分，颜色为蓝色

    let index = 0//这是第几道题，从0开始


    //先渲染一遍
    render(index)
    page.innerHTML = `${index + 1}/${arr.length}`
    //把文字渲染在页面中
    function render(index) {
      question.innerHTML = arr[index].ques
      chosetext[0].innerHTML = arr[index].options[0]
      chosetext[1].innerHTML = arr[index].options[1]
      chosetext[2].innerHTML = arr[index].options[2]
      chosetext[3].innerHTML = arr[index].options[3]
      page.innerHTML = `${+index + 1}/${arr.length}`
      arr2 = JSON.parse(localStorage.getItem("arr2"))//从本地取出arr2
      if (arr2[index] == 1) {
        answer.innerHTML = arr[index].answshow
        answer.style.display = 'block'
        answer.style.backgroundColor = 'skyblue'
        if(arr[index].answ==1){
          answer.innerHTML = `答案是A`
        }
        if(arr[index].answ==2){
          answer.innerHTML = `答案是B`
        }
        if(arr[index].answ==3){
          answer.innerHTML = `答案是C`
        }
        if(arr[index].answ==4){
          answer.innerHTML = `答案是D`
        }
      }
      else {
        answer.style.display = 'none'
      }
      //要把渲染好的数据存到用户本地
    }

    //对第一题和最后一题进行边界限制在两个按钮中完成


    //清除缓存按钮
    clean.addEventListener("click", function () {
      arr2 = JSON.parse(localStorage.getItem("arr2"))//从本地取出arr2
      for (let i = 0; i < arr.length; i++) {
        arr2[i] = 0
      }
      localStorage.setItem("arr2", JSON.stringify(arr2))
      location.reload()
    })

    //上一题按钮 
    lastbtn.addEventListener("click", function () {
      if (index == 0) {
        alert("已经是第一题了")
      }
      else {
        index--
        render(index)
        // answer.style.display = 'none'
      }

    })
    //下一题按钮
    nextbtn.addEventListener("click", function () {
      if (index == arr.length - 1) {
        alert("已经是最后一题了")
      }
      else {
        index++

        render(index)

        // answer.style.display = 'none'

      }
    })
    let j = 2
    //制作page点击事件，点击后出现目录
    page.addEventListener("click", function () {

      if (j % 2 == 0) {
        catalo.style.display = 'block'
        for (let i = 0; i < arr.length; i++) {
          let a = document.createElement("a")
          a.innerHTML = `<a data-num="${i}">${i + 1}</a>`
          catalo.appendChild(a)
        }
        nextbtn.style.display = 'none'
        lastbtn.style.display = 'none'

      }
      else {
        catalo.style.display = 'none'
        catalo.innerHTML = ''
        nextbtn.style.display = 'block'
        lastbtn.style.display = 'block'
      }
      j++
    })
    //把a的点击事件委托给catalo
    catalo.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        index = e.target.dataset.num
        catalo.style.display = 'none'
        catalo.innerHTML = ''
        nextbtn.style.display = 'block'
        lastbtn.style.display = 'block'
        render(index)
        j++
      }
    })


    //监听答案的选择 用户点击整个li框的时候，颜色变化，复选框激活
    //1到4分别对应ABCD
    //当用户选择后，给出答案
    //如果答对，答案的背景为蓝色，否则为红色
    //用户选择的选项也变成红色或蓝色
    for (let i = 1; i <= 4; i++) {
      choses[i - 1].addEventListener("click", function () {
        //用于保存做题进度的arr2，一旦点击了选项，就判断为做过
        arr2[index] = 1
        //存入本地
        localStorage.setItem("arr2", JSON.stringify(arr2))
        if (chosepoint[i - 1].value == arr[index].answ) {
          //答对了
          answer.innerHTML = arr[index].answshow
          answer.style.display = 'block'
          answer.style.backgroundColor = 'skyblue'
          if(arr[index].answ==1){
            answer.innerHTML = `正确 答案是A`
          }
          if(arr[index].answ==2){
            answer.innerHTML = `正确 答案是B`
          }
          if(arr[index].answ==3){
            answer.innerHTML = `正确 答案是C`
          }
          if(arr[index].answ==4){
            answer.innerHTML = `正确 答案是D`
          }
          

        }
        else {
          //答错了
          answer.innerHTML = arr[index].answshow
          answer.style.display = 'block'
          answer.style.backgroundColor = 'pink'
          if(arr[index].answ==1){
            answer.innerHTML = `错误 答案是A`
          }
          if(arr[index].answ==2){
            answer.innerHTML = `错误 答案是B`
          }
          if(arr[index].answ==3){
            answer.innerHTML = `错误 答案是C`
          }
          if(arr[index].answ==4){
            answer.innerHTML = `错误 答案是D`
          }
        }

      })
    }

  } catch (error) {
    console.error('Error:', error);
  }
}
Run();
