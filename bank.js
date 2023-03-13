// 名前空間configを作成して、メンバ変数にinitialFormとbankPageの要素情報を保存してください。
// configは名前空間で、アプリの設定を表します。
// 名前空間を使っているので名前の衝突を防ぐことができます。
// 名前空間のデータはアプリ内で繰り返し使用されます。将来、他のコードに触れることなく値を変更することができます。
const config = {
  initialForm: document.getElementById('initial-form'),
  bankPage: document.getElementById('bankPage'),
};

// 個々のユーザーをオブジェクトとして管理するためにBankAccountクラスを作成してください。
class BankAccount {
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
}

// アカウント番号にランダムな整数
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// page1 で submit がクリックされると入力されたデータに応じて BankAccount オブジェクトを作成する関数
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

  // 1ページ目非表示
  config.initialForm.classList.add('d-none');

  // 2ページ目の呼び出し
  config.bankPage.append(mainBankPage(userBankAccount));
}

// page2 を作成する関数
function mainBankPage(bankAccount) {
  let infoCon = document.createElement('div');
  infoCon.classList.add('text-end', 'mb-4', 'px-4');

  let nameP = document.createElement('p');
  nameP.classList.add('font-size', 'm-3', 'p-1');

  // namePと全く同じクラスを持っているのでコピー
  let bankIdP = nameP.cloneNode(true);
  let initialDepositP = nameP.cloneNode(true);

  // オブジェクトの挿入
  nameP.innerHTML = bankAccount.getFullName();
  bankIdP.innerHTML = bankAccount.accountNumber;
  initialDepositP.innerHTML = `$${bankAccount.initialDeposit}`;

  infoCon.append(nameP, bankIdP, initialDepositP);

  let balanceCon = document.createElement('div');
  balanceCon.classList.add('px-3');
  balanceCon.innerHTML = `
    <div class="d-flex justify-content-center bg-danger col-12 py-1 py-md-2">
      <p class="col-6 text-start font-size px-4">Available Balance</p>
      <p class="col-6 text-end font-size px-4">$${bankAccount.money}</p>
    </div>
    `;

  let menuCon = document.createElement('div');
  menuCon.classList.add('d-flex', 'justify-content-center', 'flex-wrap', 'text-center', 'py-1', 'px-3');
  menuCon.innerHTML = `
    <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
      <div id="withdrawBtn" class="bg-blue hover p-4">
        <p class="font-size mb-3">WITHDRAWAL</p>
        <i class="fas fa-wallet fa-3x"></i>
      </div>
    </div>
    <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
      <div id="depositBtn" class="bg-blue hover p-4">
        <p class="font-size mb-3">DEPOSIT</p>
        <i class="fas fa-coins fa-3x"></i>
      </div>
    </div>
    <div class="col-lg-4 col-12 py-1 py-md-3 px-md-1">
      <div id="comeBackLaterBtn" class="bg-blue hover p-4">
        <p class="font-size mb-3">COME BACK LATER</p>
        <i class="fas fa-home fa-3x"></i>
      </div>
    </div>
  `;

  menuCon.querySelectorAll('#withdrawBtn')[0].addEventListener('click', function () {
    alert('withdraw');
  });
  menuCon.querySelectorAll('#depositBtn')[0].addEventListener('click', function () {
    alert('deposit');
  });
  menuCon.querySelectorAll('#comeBackLaterBtn')[0].addEventListener('click', function () {
    alert('come back later');
  });

  let container = document.createElement('div');
  container.append(infoCon, balanceCon, menuCon);

  return container;
}

// page3を作成する関数
function billInputSelector(title) {
  let container = document.createElement('div');
  container.innerHTML = `
    <h2 class="text-center fw-bold pb-3">${title}</h2>

      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$100</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="5" />
        </div>
      </div>
      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$50</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="1" />
        </div>
      </div>
      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$20</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="2" />
        </div>
      </div>
      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$10</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="3" />
        </div>
      </div>
      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$5</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="1" />
        </div>
      </div>
      <div class="form-group row pb-3">
        <div class="col-3">
          <h5 class="text-center py-1">$1</h5>
        </div>
        <div class="col-9">
          <input type="number" class="form-control text-end" placeholder="4" />
        </div>
      </div>

      <div class="money-box bg-orient col-12 p-3">
        <h5 class="text-center text-light mb-0">$0.00</h5>
      </div>

      <div class="row pt-3">
        <div class="col-6">
          <button class="btn btn-outline-primary fw-bold col-12 p-3">Go back</button>
        </div>
        <div class="col-6">
          <button class="btn btn-primary fw-bold col-12 p-3">Next</button>
        </div>
      </div>
  `;
  return container;
}
