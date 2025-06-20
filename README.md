# Open Market

## 한 것

요구사항이 까다롭고 복잡한 상태를 다뤄야하는 경우도 있어서, 익숙한 형태로 코드를 작성하고자 야크 털 깎기를 조금 했습니다. 

### DOM 및 상태 관리

- [src/shared/element-helper/element-helper.js](src/shared/element-helper/element-helper.js)
- Signal 기반의 fine-grained reactivity 구현체입니다.
- JSX와 호환되는 `h(tag, props, ...children)` Element 생성 함수를 구현했습니다.
  - ```js
    h("p", null, "집가고싶다")
    // <p>집가고싶다</p>
    
    h("input", { type: "tel" })
    // <input type="tel">

    h("button", { onclick: () => alert("갈 수 없어요") }, "퇴근")
    // <button>퇴근</button>
    // 클릭하면 alert이 뜸
    ```
  - ```js
    h(App, null, "Hello, world!")

    // 컴포넌트도 만들 수 있습니다
    function App(props) {
      return h("p", { class: "text-gray-3" }, props.children);
    }

    // JSX 컴파일러를 만든다면 이렇게도 쓸 수 있겠죠...
    <App>Hello, world!</App>

    function App(props) {
      return <p class="text-gray-3">{props.children}</p>
    }
    ```
- 상태를 담고 전파하는 Signal을 구현했습니다.
  - ```js
    const [count, setCount] = createSignal(0);
    // Signal을 생성합니다. 상태라고 생각하시면 좋습니다.
    // createSignal의 첫번째 인자에는 초깃값을 넣습니다. 즉, 지금은 false인 상태입니다.
    // 함수는 [read, write] 배열을 반환합니다.
    // read 함수는 값을 읽을 때, write 함수는 값을 쓸 때 사용합니다.

    count() // 0
    setCount(1) // 값을 1로 바꿈
    count() // 1
    setCount((count) => count + 1) // 이전 값을 기준으로 바꿈 (예시에선 count = 1이므로 2가 됨)

    h("p", null, "카운트: ", count)
    // h 함수의 props와 children의 각 요소에 함수가 들어오면 반응형 트리를 만들려고 시도합니다.
    // 이 함수 안에 read 함수가 있다면, 짝이 되는 write 함수에 다른 값을 넣을 때마다 DOM에 변경을 만듭니다.
    
    h("button", { onclick: () => setCount(count => count + 1) }, "증가")
    // 버튼을 누르면 write 함수인 setCount가 값을 1씩 증가시킵니다.
    // 증가한 값은 이전 값과 다르므로 read 함수인 count 함수가 바인딩된 DOM에 변경을 만듭니다.
    ```
- 사이드 이펙트를 다루는 Effect를 구현했습니다. 자동으로 의존성을 추적합니다.
  - ```js
    const [count, setCount] = createSignal(0);
    
    createEffect(() => {
      console.log(count());
    });
    // count() 값이 변할 때마다 createEffect의 인수로 넣은 함수가 재호출됨
    ```
- `Show`와 `For`같은 기본 흐름 제어 컴포넌트를 제공합니다. (각각 조건과 반복 역할)
  - ```js
    const [done, setDone] = createSignal(false);

    fr(
      h("button", { onclick: () => setOn(on => !on) }, () => done() ? "취소" : "완료")
      h(Show, { when: on, render: () => "끝났다" })
    )
    ```
  - ```js
    const [todos] = createSignal([
      { id: 0, todo: "집에가기" },
      { id: 1, todo: "잠자기" },
      { id: 2, todo: "수면하기" },
    ]);

    h(For, { each: items, render: (item) => h("li", null, item.todo) })
    // => <li>집에가기</li><li>잠자기</li><li>수면하기</li>

    // resolveKey로 key를 지정하면 key를 기준으로 최소한의 변경만 만듦
    h(For, { each: items, render: (item) => item.todo, resolveKey: (item) => item.id })
    // => <li>집에가기</li><li>잠자기</li><li>수면하기</li>
    // 삭제가 되고 순서가 바뀌어도 제대로 반영됨 
    ```
- 일부 SVG 태그 지원하여 아이콘 색을 동적으로 변경할 수 있게 만들었습니다. [src/shared/icon/icon.js](src/shared/icon/icon.js)
- 메모리 누수 없이 컴포넌트나 요소가 제거될 때 연결된 상태나 이펙트가 제대로 파괴되도록 노력했습니다.

### 사용자 세션 관리

- [src/shared/auth/auth.js](src/shared/auth/auth.js)
- 사용자 인증이 필요한 API 요청마다 access token이 만료되었다면 자동으로 재발급하도록 구현하여, 로그인 풀림 없는 매끄러운 사용자 경험을 제공하도록 구현했습니다.
- 사용자 상태를 Signal에 담아서, 로그인 즉시 모든 UI에 반영되는 것을 보장합니다.
  - ```js
    auth.user // 반응성을 가지는 user 객체
    ```
- 로그인과 로그아웃을 하는 유틸 함수를 제공합니다.
  - ```js
    // 로그인
    await auth.login(username, password);

    // 로그아웃
    auth.logout();
    ```
- 페이지를 새로고침하거나 브라우저를 껐다 켜도 로그인이 유지됩니다.

### 라우터 

- [src/shared/router/router.js](src/shared/router/router.js)
- 라우팅 관련 컴포넌트와 클래스로 구성되어있습니다.
  - ```js
    router.navigateTo("/");
    // /로 이동

    router.navigateTo("/login", { replace: true });
    // /login으로 이동하면서 히스토리를 덮어씀
    ```
- 로그인의 이전 페이지로 가는 동작을 `history.back()`으로 구현하는 것은 어색한 사용자 경험을 만들 것 같아서 이전 페이지 정보를 별도로 유지하고 활용하였습니다.
  - ```js
    router.back();
    // 이전 페이지로 이동하지만, 브라우저 뒤로가기와 달리 앞으로 나아감
    ```

### API 빌더

- [src/shared/api/index.js](src/shared/api/index.js)
- 다양한 조건의 API 요청을 쉽게 할 수 있도록 유연한 구조로 설계했습니다.
  - ```js
    await api.get("/products/").send()
    // `(위니브API경로)/products/`에 GET 요청을 보냄

    await api.post("/accounts/buyer/signup/").body({
      username,
      password,
      name,
      phone_number
    }).send()
    // body를 포함한 POST 요청을 보냄
    ```
- 위니브 API 주소 적용, 사용자 인증과 같이 자주 사용하는 것들은 플러그인으로 묶었습니다. [src/shared/api/plugins.js](src/shared/api/plugins.js)
  - ```js
    await api.post("/").use(authn()).send();
    // 플러그인은 .use()함수에 넣습니다.
    // authn 플러그인은 사용자 세션 관리 덕분에 access token이 만료되었다면 자동으로 재발급을 한 뒤 요청을 보냅니다.
    ```
### 스키마 검증

- [src/shared/schema/schema-builder.js](src/shared/schema/schema-builder.js)
- 폼 검증에 사용할 간단한 검증 시스템을 구현했습니다. 객체, 문자열, 숫자, 불린을 지원합니다.
- ```js
  const schema = sb.string().min(1);
  // 길이가 1이상인 문자열만 통과합니다.

  schema.parse(53) // 실패
  schema.parse("") // 실패
  schema.parse("집가고싶다") // 통과
  ```

### 폼 검증 및 UI

- [src/features/form/create-form.js](src/features/form/create-form.js)
- 필드를 기준으로 값을 자동으로 가져오고 유지하는 Signal, 일반화된 검증, id 자동 생성 등 다양한 기능을 제공합니다.
- ```js
  function LoginForm() {
    const form = createForm({
      fields: {
        username: {
          parse: usernameSchema.parse,
        },
        password: {
          parse: passwordSchema.parse,
        }
      },
      onsubmit: async (data) => {
        await auth.login(data.username, data.password);
      },
      onerror: (error) => {
        // onsubmit에서 발생한 에러가 들어옴
      }
    });
  
    
    return h("form", { onsubmit: form.onsubmit }, [
      h(FormField, {
        form,
        name: "username",
        render: (field) => fr(
          h(FormLabel, { field }, "아이디"),
          h(FormInput, {
            field,
            placeholder: "아이디를 입력해주세요",
          }),
          h(FormErrors, { field }),
        )
      }),
      h(FormField, {
        form,
        name: "password",
        render: (field) => fr(
          h(FormLabel, { field }, "비밀번호"),
          h(FormInput, {
            field,
            placeholder: "비밀번호를 입력해주세요",
          }),
          h(FormErrors, { field }),
        )
      }),
    ])
  }
  ```

## 안 한 것

- Select 컴포넌트 구현
- modal과 dropdown 애니메이션
- 도전 과제

## 아쉬운 것

- 요구사항을 모두 만족시키지 못해서 아쉽습니다.
- 요구사항을 모두 만족하는 구조 설계를 제대로 하지 못해서 꼼수로 해결한 부분이 몇 부분 있어 아쉽습니다.
- 변수, 함수, 파일, 폴더 이름 중 적합하지 않은 것들이 있어 아쉽습니다.
