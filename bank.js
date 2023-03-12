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
}
