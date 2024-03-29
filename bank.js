// 要素を非表示にする関数
function displayNone(ele) {
  ele.classList.remove('d-block');
  ele.classList.add('d-none');
}

// 要素を表示する関数
function displayBlock(ele) {
  ele.classList.remove('d-none');
  ele.classList.add('d-block');
}

// 名前空間configを作成して、メンバ変数にinitialFormとbankPageの要素情報を保存
// configは名前空間で、アプリの設定を表す
// 名前空間を使っているので名前の衝突を防ぐことができる
// 名前空間のデータはアプリ内で繰り返し使用される。将来、他のコードに触れることなく値を変更することができる
const config = {
  initialForm: document.getElementById('initial-form'),
  bankPage: document.getElementById('bankPage'),
  sidePage: document.getElementById('sidePage'),
};

// 個々のユーザーをオブジェクトとして管理するためのクラス
class BankAccount {
  maxWithdrawPercent = 0.2;
  annualInterestRate = 0.08;

  constructor(firstName, lastName, email, type, accountNumber, money) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.type = type;
    this.accountNumber = accountNumber;
    this.money = money;
    this.initialDeposit = money;
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  //  金額を受け取り、所持金の20%以下ならその金額、20%以上なら所持金の20%を返すメソッド
  calculateWithdrawAmount(amount) {
    let maxWithdrawAmount = Math.floor(this.money * this.maxWithdrawPercent);

    if (amount > maxWithdrawAmount) return maxWithdrawAmount;
    else return amount;
  }

  withdraw(amount) {
    // this.moneyをアップデート
    this.money -= this.calculateWithdrawAmount(amount);
    return this.calculateWithdrawAmount(amount);
  }

  deposit(amount) {
    this.money += amount;
    return amount;
  }

  // 日にちを受け取って利子を計算するメソッド money * (1 + i) ^ (days/365)
  // 今回はday1から複利が適用されるとする
  // (日にちが浅い場合は単利、日にちが経過した場合は複利のような計算もありますが、今回は全ての計算を複利とする)
  simulateTimePassage(days) {
    let daysPerYear = 365;
    let profit = this.money * Math.pow(1 + this.annualInterestRate, days / daysPerYear) - this.money;
    // 残高に反映
    this.money += profit;
    return profit;
  }
}

// アカウント番号にランダムな整数
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// page1 でsubmitボタンがクリックされると入力されたデータに応じて BankAccount オブジェクトを作成する関数
function initializeUserAccount() {
  const form = document.getElementById('bank-form');
  let userBankAccount = new BankAccount(
    // querySelectorAllを使って、セレクタの文字列をリストとして取得
    // querySelectorAll(`input[name="id名"]`)によってinputタグの特定のidの情報を取得
    // リストとして返されるのでitem(0)メソッド、もしくは[0]を使って最初のhtml要素を取得
    form.querySelectorAll(`input[name="userFirstName"]`).item(0).value,
    form.querySelectorAll(`input[name="userLastName"]`).item(0).value,
    form.querySelectorAll(`input[name="userEmail"]`).item(0).value,
    form.querySelectorAll(`input[name="userAccountType"]:checked`).item(0).value,
    getRandomInteger(1, Math.pow(10, 8)),
    // 入力された金額は文字列なので、int型に変換して初期化
    parseInt(form.querySelectorAll(`input[name="userFirstDeposit"]`).item(0).value)
  );
  console.log(userBankAccount);

  // page1 を非表示
  config.initialForm.classList.add('d-none');

  // page2 の呼び出し
  config.bankPage.append(mainBankPage(userBankAccount));
}

// page2 を作成する関数
function mainBankPage(bankAccount) {
  let infoCon = document.createElement('div');
  infoCon.classList.add('text-end', 'mb-4', 'px-4');

  let nameP = document.createElement('p');
  nameP.classList.add('text-dark', 'm-3', 'p-1');

  // namePと全く同じクラスを持っているのでコピー
  let bankIdP = nameP.cloneNode(true);
  let initialDepositP = nameP.cloneNode(true);

  // オブジェクトの挿入
  nameP.innerHTML = bankAccount.getFullName();
  bankIdP.innerHTML = `Bank ID: ${bankAccount.accountNumber}`;
  initialDepositP.innerHTML = `$${bankAccount.initialDeposit}`;

  infoCon.append(nameP, bankIdP, initialDepositP);

  let balanceCon = document.createElement('div');
  balanceCon.classList.add('px-3');
  balanceCon.innerHTML = `
  <div class="d-flex justify-content-center  btnx-cyan col-12 py-1 py-md-2">
    <p class="col-6 text-start  px-4">Available Balance</p>
    <p class="col-6 text-end  px-4">$${bankAccount.money}</p>
  </div>
  `;

  let menuCon = document.createElement('div');
  menuCon.classList.add('d-flex', 'justify-content-center', 'flex-wrap', 'text-center', 'py-1', 'px-3');
  menuCon.innerHTML = `
  <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
    <div id="withdrawBtn" class="bg-blue  rounded hover p-4">
      <p class=" mb-3">WITHDRAWAL</p>
      <i class="fas fa-wallet fa-3x"></i>
    </div>
  </div>
  <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
    <div id="depositBtn" class="bg-blue rounded  hover p-4">
      <p class=" mb-3">DEPOSIT</p>
      <i class="fas fa-coins fa-3x"></i>
    </div>
  </div>
  <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
    <div id="comeBackLaterBtn" class="bg-blue rounded  hover p-4">
      <p class=" mb-3">COME BACK LATER</p>
      <i class="fas fa-home fa-3x"></i>
    </div>
  </div>
  `;

  menuCon.querySelectorAll('#withdrawBtn')[0].addEventListener('click', function () {
    sideBankSwitch();
    config.sidePage.append(withdrawPage(bankAccount));
  });

  menuCon.querySelectorAll('#depositBtn')[0].addEventListener('click', function () {
    sideBankSwitch();
    config.sidePage.append(depositPage(bankAccount));
  });

  menuCon.querySelectorAll('#comeBackLaterBtn')[0].addEventListener('click', function () {
    sideBankSwitch();
    config.sidePage.append(comeBackLaterPage(bankAccount));
  });

  let container = document.createElement('div');
  container.append(infoCon, balanceCon, menuCon);

  return container;
}

// page3 の一部を作成する関数
function billInputSelector(title) {
  let container = document.createElement('div');
  container.innerHTML = `
  <h2 class="text-center fw-bold pb-3">${title}</h2>

    <div class="form-group row pb-3">
      <div class="col-3">
        <h5 class="text-center py-1">$100</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="100" id="moneyWithdraw100" placeholder="5" />
      </div>
    </div>
    <div class="form-group row pb-3">
      <div class="col-3">
        <h5 class="text-center py-1">$50</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="50" id="moneyWithdraw50" placeholder="1" />
      </div>
    </div>
    <div class="form-group row pb-3">
      <div class="col-3">
        <h5 class="text-center py-1">$20</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="20" id="moneyWithdraw20" placeholder="2" />
      </div>
    </div>
    <div class="form-group row pb-3">
      <div class="col-3">
        <h5 class="text-center py-1">$10</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="10" id="moneyWithdraw10" placeholder="3" />
      </div>
    </div>
    <div class="form-group row pb-3">
      <div class="col-3">
        <h5 class="text-center py-1">$5</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="5" id="moneyWithdraw5" placeholder="1" />
      </div>
    </div>
    <div class="form-group row pb-4">
      <div class="col-3">
        <h5 class="text-center py-1">$1</h5>
      </div>
      <div class="col-9">
        <input type="number" class="form-control text-end withdraw-bill bill-input" data-bill="1" id="moneyWithdraw1" placeholder="4" />
      </div>
    </div>

    <div class="money-box text-center p-3">
        <p class="text-light" id="totalBillAmount">$0.00</p>
    </div>
  `;
  return container;
}

// 文字列を受け取り、文字列に応じてボタンを作成する関数
function backNextBtn(backString, nextString) {
  let container = document.createElement('div');
  container.innerHTML = `
  <div class="row pt-4">
    <div class="col-6">
      <button class="btn btn-outline-primary fw-bold col-12 p-3 back-btn">${backString}</button>
    </div>
    <div class="col-6">
      <button class="btn btn-primary fw-bold col-12 p-3 next-btn">${nextString}</button>
    </div>
  </div>
  `;
  return container;
}

// withdrawボタンがクリックされた時に、bankPageを非表示にし、sidePageを表示する関数
// function withdrawController(bankAccount) {
//   displayNone(config.bankPage);
//   displayBlock(config.sidePage);

// 新しい情報をレンダリングするため、一度両方のページを空にする
//   config.bankPage.innerHTML = '';
//   config.sidePage.innerHTML = '';

// withdrawのページをsidePageにappend
//   config.sidePage.append(withdrawPage(bankAccount));
// }

// withdrawページを表示する上ののwithdrawController関数をsideBankSwitch関数として書き換える (DRYを避けるため)
// menuを押す ---> 各ページに飛ぶ すべて同じ処理
// この関数はdepositページ、come back laterページを表示する時にも使う
function sideBankSwitch() {
  displayNone(config.bankPage);
  displayBlock(config.sidePage);

  // 新しい情報をレンダリングするため、一度両方のページを空にする
  config.bankPage.innerHTML = '';
  config.sidePage.innerHTML = '';
}

// sidePage を消して bankPage を表示する関数
function bankReturn(bankAccount) {
  displayNone(config.sidePage);
  displayBlock(config.bankPage);
  config.bankPage.append(mainBankPage(bankAccount));
}

// billInputSelector関数と、backNextBtn関数を使い page3を作成する関数
function withdrawPage(bankAccount) {
  let container = document.createElement('div');
  container.classList.add('p-4');

  let withdrawContainer = document.createElement('div');
  container.append(withdrawContainer);

  withdrawContainer.append(billInputSelector('Please Enter The Withdrawal Amount'));
  withdrawContainer.append(backNextBtn('Go back', 'Next'));

  let backBtn = withdrawContainer.querySelectorAll('.back-btn').item(0);
  backBtn.addEventListener('click', function () {
    bankReturn(bankAccount);
  });

  // inputタグを取得
  let billInputs = withdrawContainer.querySelectorAll('.bill-input');

  for (let i = 0; i < billInputs.length; i++) {
    // 各inputに値が入力される度に、金額と掛け合わされた総額が totalのboxに表示
    billInputs[i].addEventListener('change', function (event) {
      // totalの場所に入力された合計金額を表示
      document.getElementById('totalBillAmount').innerHTML = `$` + billSummation(billInputs, 'data-bill').toString();
    });
  }

  // nextを押した時に 次のページに page4 を表示
  let nextBtn = withdrawContainer.querySelectorAll('.next-btn').item(0);
  nextBtn.addEventListener('click', function () {
    // 現在のwithdrawPageを空にする
    container.innerHTML = '';

    let confirmDialog = document.createElement('div');
    confirmDialog.append(billDialog('The money you are going to take is ...', billInputs, 'data-bill'));
    container.append(confirmDialog);

    // HTMLを追加し、金額のところに引き落とすことができる金額を表示
    let total = billSummation(billInputs, 'data-bill');

    confirmDialog.innerHTML += `
    <div class="d-flex justify-content-center btnx-cyan text-white py-1 py-md-2">
      <p class="col-6 text-start  px-4">Total to be withdrawn: </p>
      <p class="col-6 text-end  px-4">$${bankAccount.calculateWithdrawAmount(total)}</p>
    </div>
    `;

    let withdrawConfirmBtns = backNextBtn('Go back', 'Confirm');
    confirmDialog.append(withdrawConfirmBtns);

    // Go Backボタンがクリックされたら、前のページに戻る
    // Confirmボタンがクリックされると、ダッシュボードに戻る 残高から引き落とした金額を引く
    let confirmBackBtn = withdrawConfirmBtns.querySelectorAll('.back-btn')[0];
    confirmBackBtn.addEventListener('click', function () {
      container.innerHTML = '';
      container.append(withdrawContainer);
    });

    let confirmNextBtn = withdrawConfirmBtns.querySelectorAll('.next-btn')[0];
    confirmNextBtn.addEventListener('click', function () {
      // 残高のアップデート
      bankAccount.withdraw(total);
      bankReturn(bankAccount);
    });
  });

  return container;
}

// data-billを持つ要素、文字列data-billを受け取り、合計金額を計算する関数
function billSummation(inputElementNodeList, multiplierAttribute) {
  let summation = 0;

  for (let i = 0; i < inputElementNodeList.length; i++) {
    let currEle = inputElementNodeList[i];
    let value = parseInt(currEle.value);

    if (currEle.hasAttribute(multiplierAttribute)) value *= parseInt(currEle.getAttribute(multiplierAttribute));
    if (value > 0) summation += value;
  }
  return summation;
}

// nextを押した後に表示されるpage4の一部を作成する関数
function billDialog(title, inputElementNodeList, multiplierAttribute) {
  let container = document.createElement('div');
  container.classList.add('p-4');

  let billElements = '';
  // pタグを <p></p><p></p><p></p> のように足し合わせる
  for (let i = 0; i < inputElementNodeList.length; i++) {
    let value = parseInt(inputElementNodeList[i].value);

    // 入力された値が0より大きい時、表示
    if (value > 0) {
      let bill = '$' + inputElementNodeList[i].getAttribute(multiplierAttribute);
      billElements += `<p class=" calculation-box mb-1 pr-2">${value} × ${bill}</p>`;
    }
  }

  // total は billSummation() で計算
  let totalString = `<p class="m-2 pt-1">total: $${billSummation(inputElementNodeList, multiplierAttribute)}</p>`;

  // innerHTMLを使うと pタグが1列で入るので、ブラウザ上では改行される(pタグがブロック要素のため)
  container.innerHTML = `
  <h2 class="text-center fw-bold pb-3">${title}</h2>
  <div class="d-flex justify-content-center">
  <div class="calculation-box text-end  col-8 px-1">
      ${billElements}
      ${totalString}
    </div>
  </div>
  `;
  return container;
}

// withdrawPage(page4) と同じ構造の depositPage(Page5) を作成する関数
function depositPage(bankAccount) {
  let container = document.createElement('div');
  container.classList.add('p-4');

  let depositContainer = document.createElement('div');
  container.append(depositContainer);

  depositContainer.append(billInputSelector('Please Enter The Deposit Amount'));
  depositContainer.append(backNextBtn('Go back', 'Next'));

  let backBtn = depositContainer.querySelectorAll('.back-btn').item(0);
  backBtn.addEventListener('click', function () {
    bankReturn(bankAccount);
  });

  // inputタグを取得
  let billInputs = depositContainer.querySelectorAll('.bill-input');

  for (let i = 0; i < billInputs.length; i++) {
    // 各inputに値が入力される度に、金額と掛け合わされた総額が totalのboxに表示
    billInputs[i].addEventListener('change', function (event) {
      document.getElementById('totalBillAmount').innerHTML = `$` + billSummation(billInputs, 'data-bill').toString();
    });
  }

  // nextを押した時に 次のページに page4 を表示
  let nextBtn = depositContainer.querySelectorAll('.next-btn').item(0);
  nextBtn.addEventListener('click', function () {
    container.innerHTML = '';

    let confirmDialog = document.createElement('div');
    confirmDialog.append(billDialog('The money you are going to deposit is ...', billInputs, 'data-bill'));
    container.append(confirmDialog);

    let total = billSummation(billInputs, 'data-bill');
    confirmDialog.innerHTML += `
    <div class="d-flex justify-content-center btnx-cyan text-white py-1 py-md-2">
     <p class="col-6 text-start  px-4">Total to be withdrawn: </p>
     <p class="col-6 text-end  px-4">$${total}</p>
    </div>
    `;
    let depositConfirmBtns = backNextBtn('Go back', 'Confirm');
    confirmDialog.append(depositConfirmBtns);

    let confirmBackBtn = depositConfirmBtns.querySelectorAll('.back-btn').item(0);
    confirmBackBtn.addEventListener('click', function () {
      container.innerHTML = '';
      container.append(depositContainer);
    });

    let confirmNextBtn = depositConfirmBtns.querySelectorAll('.next-btn').item(0);
    confirmNextBtn.addEventListener('click', function () {
      bankAccount.deposit(total);
      bankReturn(bankAccount);
    });
  });

  return container;
}

// come back laterページ (page6) を作成する、comeBackLaterPage関数
function comeBackLaterPage(bankAccount) {
  let container = document.createElement('div');
  container.classList.add('p-4');

  container.innerHTML = `
  <div class="text-center col-12 ">
    <h2 class="text-center fw-bold pb-3">How many days will you be gone?</h2>

    <div class="form-group">
      <input type="text" class="form-control p-3" id="days-gone" placeholder="4" />
    </div>
  </div>
  `;

  container.append(backNextBtn('Go back', 'Confirm'));

  let backBtn = container.querySelectorAll('.back-btn')[0];
  backBtn.addEventListener('click', function () {
    bankReturn(bankAccount);
  });

  // Confirmボタンがクリックされた時、入力されている値を元に利子を計算し、残高に反映
  // 例えば、年利8%で365日(1年間)このページに帰ってこないと仮定すると、残高は money * (1 + 0.08)になる
  // このシミュレーションを残高に反映させます。
  let nextBtn = container.querySelectorAll('.next-btn')[0];
  nextBtn.addEventListener('click', function () {
    let daysGoneInput = container.querySelectorAll('#days-gone')[0];
    let totalDaysGone = parseInt(daysGoneInput.value);
    totalDaysGone = totalDaysGone > 0 ? totalDaysGone : 0;
    bankAccount.simulateTimePassage(totalDaysGone);
    bankReturn(bankAccount);
  });

  return container;
}
