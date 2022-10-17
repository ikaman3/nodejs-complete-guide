494_TypeScript

What is TypeScript? And Why?

TypeScript is a Superset to JavaScript
add('2', '3');
==> Unwanted behavior at runtime! ===> You could add an 'if' check to avoid the error
TypeScript adds strict typing <===== "Unnecessary" step that could be avoided with strict types

TypeScript은 자바스크립트의 수퍼셋(Superset)으로 자바스크립트에 기반해 확장한다는 뜻이다. 하지만 자바스크립트와 달리 TypeScript는 브라우저에 실행되지 않고 자바스크립트에 컴파일해 실행한다. 
TypeScript는 개발자에게 더 나은 개발 경험을 선사한다. 코드에 개발 중에만 존재하는 몇 가지 기능을 추가해서 더 나은 코드를 작성하고 오류를 방지하는데 도움을 준다. 
예를 들어 아래와 같은 코드가 있다.
    function add(n1, n2) {
        return n1 + n2;
    }
    console.log(add('2', '3'));
브라우저의 개발자 도구를 열어 콘솔에서 코드를 실행해본다. add(2, 3); 를 입력하면 제대로 5가 반환되지만 위처럼 2, 3을 문자열로 입력하면 문자열 23이 반환된다. 문자열이 하나의 문자열로 연결된 것이다. 이것이 자바스크립트의 원리이다. 더하기 연산 중에 하나 이상의 피연산자가 문자열이면 두 개가 모두 문자열로 결합된다.
페이지에서 사용자의 입력값을 추출하면 어떤 데이터든지 입력값에서 추출하면 자바스크립트에서는 텍스트로 추출된다. 즉 사용자가 페이지에 숫자를 입력했어도 데이터를 추출하면 문자열이 나온다는 것이다. 이걸 숫자로 전환하는 걸 잊고 그대로 함수에 전달하면 의도치 않은 결과가 나올 수 있다.

이런 경우 TypeScript로 런타임 중에 일어나는 원치 않는 작동을 막을 수 있다. 코드를 실행할 때 TypeScript를 사용하면 된다. 물론 자바스크립트에서도 가능하다. if 문 같은 검사문을 추가해 받은 값이 문자열인지 숫자인지 검사하는 등이다. 하지만 코드가 잘 작동하는지 확인하기 위해 런타임 중에 추가적인 코드를 작성해야 하므로 번거롭다. 
그러나 엄격한 유형 검사가 있으면 개발 중 과정이 필요 없다. 자바스크립트에 미리 어떤 유형의 데이터를 원하는지 알려주면 자바스크립트와 IDE와 프로그램에 틀린 유형의 데이터를 받는 코드가 있다면 알려준다. 
이렇게 엄격한 타이핑을 추가하는 게 TypeScript이다.

TypeScript Overview

TypeScript adds...
    Types
    Next-gen JavaScript Features (compiled down for older Browsers)
    Non-JavaScript Features like Interfaces or Generics
    Meta-Programming Features like Decorators
    Rich Configuration Options
    Modern Tooling that helps even in non-TypeScript Projects

TypeScript는 전반적으로 자바스크립트에 추가하는 기능이 많다. 가장 중요한 게 Types 데이터 유형으로 TypeScript 이름이 여기서 유래했다. 
그 외에도 일부 다음 세대 자바스크립트 기능을 잠금 해제해서 Babel 같은 추가적인 도구 없이도 코드에 사용할 수 있게 한다. 
또한 자바스크립트에 존재하지 않는 기능도 추가하여 코드를 더 깔끔하게 쓰도록 돕는다. 
이런 기능들은 컴파일 후에는 제거되지만 개발 중에는 코드 작성에 유용하다.
더불어 Decorators 등의 메타프로그래밍 기능을 추가하고 개발자가 코드 컴파일 방식을 미세 조정할 수 있도록 구성 옵션을 제공한다.
전반적으로 최신 도구를 많이 제공하고 결합할 수 있게 해서 훌륭한 개발 경험을 제공한다.
===========================================================================================
495_TypeScript 설정

간단한 index.html 파일을 생성한다. 버튼을 클릭하면 두 개의 입력값이 추가되어 버튼 아래에 있는 단락(p)에 출력된다.
    <script src="app.js" defer></script>
- defer 를 추가하여 body 전체를 분석한 후에만 실행되도록 한다.
    ...
    <body>
        <input type="number">
        <input type="number">
        <button>Add</button>
        <p></p>
    </body>

그리고 app.ts 파일을 생성한다. 이곳에 타입스크립트 코드를 작성할 것이다. 그리고 타입스크립트 컴파일러를 설치해야 한다. Deno와는 다르게 타입스크립트는 컴파일러가 필요한데 왜냐하면 브라우저에서 코드를 실행하려는데 브라우저는 타입스크립트를 실행하지 않기에 타입스크립트를 자바스크립트로 변환해야 하기 때문이다. Deno에서도 전환이 필요하지만 타입스크립트 컴파일러가 내장되어 있으므로 괜찮다.
타입스크립트 컴파일러만 설치하기 위해서는 typescriptlang.org 에 나와있는 설명에 따라 터미널에 명령어를 입력한다.
    sudo npm install -g typescript
- mac, linux에서는 sudo를 붙여서 권한을 얻어야 한다.
- 이때 npm 명령어를 사용하려면 Node.js가 설치되어 있어야 한다.

이제 터미널에 tsc app.ts 등으로 컴파일하고 싶은 파일이름을 입력하면 app.js 파일이 생성된다. 코드 작성은 .ts 파일에만 한다.
app.ts =>
    function add(n1, n2) {
        return n1 + n2;
    }
    console.log(add(1, 6));
    console.log(add('1', '6'));
저장하고 tsc app.ts 로 컴파일한 후 index.html 파일을 실행하면 브라우저에서 볼 수 있다. 
===========================================================================================
496_Type 할당

Core Types

number: 1, 5.3, -10 / All numbers, no differentiation between integers or floats
string: 'Hell', "Hell", `Hell` / All text values
boolean: true, false / Just these two, no 'truthy' or 'falsy' values
object: {age: 30} / Any Javascript object, more specific types(type of object) are possible
Array: [1, 2, 3] / Any Javascript array, type can be flexible or strict(regarding the element tpyes)

타입스크립트에는 많은 핵심 유형이 내장되어 있다. 예를 들어 숫자(Number) 타입은 정수뿐만 아니라 부동소수점 실수, 음수 등 모든 숫자를 포함한다. 
문자열(String) 타입에는 작은따옴표 혹은 큰따옴표 안에 있는 텍스트나 백틱 안에 있는 템플릿 리터럴이 포함된다.
불리언(Boolean) 타입은 true, false를 받는다. 이 두 가지 값만 허용된다.
객체(Object) 타입으로 정의하면 다음과 같은 객체를 허용한다. 이때 보통 객체 타입인지 객체가 어떻게 보일지 구체적으로 속성을 설정할 수 있다.
배열(Array) 타입은 숫자의 배열 등을 말하며, 이때도 아무 콘텐츠나 가능한지 숫자 배열만 허용할지 정의할 수 있다. 

이제 문자열을 전달하는 것을 막기 위해 타입스크립트 파일에 변수나 매개변수 등의 유형을 설정한다. 매개변수나 변수 이름 다음에 콜론과 사용하고자 하는 유형을 추가한다. 이 경우에는 숫자만 받기 위해 number를 사용한다.
    function add(n1: number, n2: number) {...}
그러면 IDE가 바로 오류를 짚어낸다. type '1' 인수가 number 타입을 지정할 수 없다고 나온다. 컴파일해도 같은 에러가 난다. 그럼에도 컴파일은 되었다. 오류가 있을 때는 컴파일하지 않도록 구성할 수 있지만 디폴트는 컴파일을 허용한다. 

여기서 컴파일된 .js 파일을 보면 : number 부분이 사라졌다. 이것은 타입스크립트 기능으로 자바스크립트에는 존재하지 않으므로 개발 중에만 오류를 나타낸다. 따라서 타입스크립트 기능은 개발 중에 버그를 잡도록 돕는다. 
사소해보일 수 있지만 타입스크립트의 핵심 기능으로, 코드를 개선하고 버그를 줄인다.
===========================================================================================
497_유형 추론 및 형 변환

함수를 form에 연결해 본다. input 태그에 id를 추가하여 app.ts에서 접근한다. 이것은 타입스크립트에서 실행할 수 있는 디폴트 자바스크립트 코드다. 타입스크립트는 자바스크립트를 기반으로 하므로 모든 자바스크립트 코드를 타입스크립트에서 실행할 수 있다.
index.html =>
    <input type="number" id="n1">
    <input type="number" id="n2">
app.ts =>
    const n1Element = document.getElementById('n1') as HTMLInputElement;
    const n2Element = document.getElementById('n2') as HTMLInputElement;
    const btnElement = document.querySelector('button');
- querySelector에 button 태그를 넣은 경우에는 이미 버튼임을 알고 있지만, ID를 통해 선택했기 때문에 타입스크립트가 어떤 요소가 해당 ID를 가질지 추론할 수 없다. 이때 사용하는 것이 형 변환(Typecasting)이다. 개발자가 어떤 것이 특정 유형이라는 것을 확신하면 타입스크립트의 as 키워드를 사용해 해당 유형을 명시한다.
- HTMLInputElement, HTMLButtonElement는 타입스크립트에 내장된 일반적인(General) 타입으로, 타입스크립트에 사용할 수 있는 일반적인 DOM 타입이다.
    ...
    btnElement.addEventListener('click', () => {
        const n1 = n1Element.value;
        const n2 = n2Element.value;
        const result = add(+n1, +n2);
        console.log(result);
- 이때 그냥 .value만 작성하면 에러가 발생한다. 모든 HTML 요소가 value 속성을 가지지 않기 때문이다. 예를 들어 input 요소에는 있지만 p 요소에는 없다. 따라서 위에서 value에 접근한다는 것을 타입스크립트에 알려야한다.
- value는 반드시 문자열을 반환한다. 따라서 상수 앞에 +를 붙여서 number 타입으로 변환해야 한다. 타입스크립트가 에러를 발생시켜주기 때문에 쉽게 찾을 수 있다.
    });
이때 IDE가 이미 btnElement에 addEventListener를 호출할 수 있다는 것을 안다. 타입스크립트 덕분이다. querySelector를 통해 버튼을 선택하면 HTMLButtonElement를 받는다는 것을 알기 때문에 btnElement에 마우스를 올리면 분명하게 정의하지 않아도 추론된 유형이 나온다. 딱히 : HTMLButtonElement를 추가하지 않았다(참고로 HTMLButtonElement는 TS가 지원하는 많은 빌트인 타입 중 하나다). 
타입스크립트가 이 상수에 어떤 유형의 값이 저장될지 코드를 기반해 추론하는 것이다. 즉 이 상수가 추후에 버튼을 가질 것을 알기 때문에 addEventListener를 호출할지 미리 아는 것이다.

컴파일해보면 js 파일에서 as 연산자와 타입들이 사라졌다. 이와 같은 코드를 자바스크립트로 작성해도 되지만 타입스크립트로 개발 중에 코드를 미리 확인하는 셈이다. 
===========================================================================================
498_TypeScript 설정

타입스크립트 컴파일러가 구성 파일을 추가했었다. 명령어를 입력해 tsconfig.json 파일을 추가한다.
    tsc --init

파일을 살펴보면 많은 옵션이 주석처리되어 있고 대부분 냅둔다.
이 중에서 strict는 보통 타입스크립트에서 허용된 것을 허용하지 않는다는 뜻인데 디폴트로 true로 되어있다. app.ts 파일에 config를 추가하기만 해도 Object is possibly 'null' 이라는 에러가 나온다. strictNullChecks 옵션의 기능인데 strict를 true로 설정하면 그 아래 모든 기능이 자동으로 켜진다.

기존 코드에서 버튼을 선택했는데 타입스크립트는 해당 버튼이 실제로 존재하는지 모른다. HTML 코드를 확인하지 않기 때문이다. 따라서 btnElement를 찾지 못하면 null이 될 가능성이 존재한다. 해결 방법이 두 가지 있다. if (btnElement)로 검사하고 밑의 코드를 조건문 안에 작성한다.
다른 방법은 input 요소에서 했던것처럼 버튼이 있는지 알아보는 것이다. 느낌표를 추가해서 느낌표 앞에 문장 혹은 표현이 이론상으로 null일 수 있지만 아니라는 것을 명시한다. null인 경우는 무시하고 다른 값을 가지도록 한다. 이때 HTMLButtonElement를 유일한 값으로 갖는다.
    const btnElement = document.querySelector('button')!;

또한 엄격 모드에서는 한 매개변수의 타입을 생략하면 매개변수가 'any' 타입이라는 에러를 표시한다. any 타입으로 직접 지정할 수는 있는데 일반적인 폴백(fallback) 유형으로 기본적으로 아무 타입 정보가 없고 모든 유형의 값이 허용되므로 데이터의 유형을 전혀 예상하지 못할 때 사용한다. 유형을 명시하지 않으면 암묵적으로 any 타입이 지정되지만 strict mode에서는 인수에 입력을 잊은 것처럼 간주하므로 any 타입이라도 설정해서 무엇이 들어올지 모른다는 사실 혹은 모든 유형의 값을 허용한다는 사실을 분명히 정해야한다. 즉, any라고 입력하는 건 되지만 입력을 생략하는 건 안된다.

config 파일을 생성했다면 tsc 명령어를 입력할 때 특정 파일을 선택한다면 구성 파일을 고려하지 않는다. 그러므로 tsc만 입력해서 실행하여 모든 유형의 파일을 폴더에 컴파일하며 구성 파일을 고려하도록 해야한다. 
한편 IDE는 반드시 config 파일을 선택한다. 따라서 어떻게 컴파일하든 언제나 IDE의 지원은 받을 수 있다.

===========================================================================================
499_유니온(Union) 타입

앱에 유연성을 더하기 위해 문자열도 다루도록 수정한다. 
app.ts => btnElement.addEventListener
    ...
    const stringResult = add(n1, n2);
    console.log(add(true, false));
n1, n2는 number만 허용했으므로 any로 수정하여 모든 타입을 받을 수 있다. 여기서 단점은 console.log(add(true, false)) 문장이 필요하다는 것이다.
문자열과 숫자만을 허용하기 위해 불리언을 사용하지 않고 유니온 타입이라는 기능을 사용한다. 여러 유형을 가진 코드를 다룰 때 사용하는데 | 로 나눠서 입력하는 게 바로 유니온 타입이다.
    function add(n1: number | string, n2: number | string)
- n1, n2의 타입이 number or string 이라는 뜻이다. 

그러면 n1 + n2 에서 에러가 발생하는데 + 연산자가 숫자, 문자열 둘 다 다루긴 하지만 타입스크립트가 아직 이 과정을 이해하지 못하기 때문이다. 보통 이런 경우 여러 유형을 허용하되 데이터 유형에 따라 다른 코드를 실행해야 한다.
    function add(n1: number | string, n2: number | string) {
        if (typeof n1 === 'number' && typeof n2 === 'number') {
            return n1 + n2;
        } else if (typeof n1 === 'string' && typeof n2 === 'string') {
            return n1 + ' ' + n2;
        }
- typeof 연산자는 자바스크립트가 제공하며 string, number 등의 타입을 반환한다.
        return +n1 + +n2;
- 여러 유형이 섞인 경우 이론상으로는 작동하지만 +를 덧붙여 숫자로 변환한다.
    }
이것은 유형 방어(Type guard)라는 개념으로 받는 값의 유형에 따라 다른 코드를 쓰는 것이다. 이제 맨 밑의 불리언을 호출할 수 없으므로 제거한다.

컴파일해보면 유니언 타입은 사라졌지만 if 조건문은 일반 자바스크립트 코드이므로 남아있다.
===========================================================================================
500_객체 및 배열 유형

이미 객체를 다루고 있다. HTMLInputElement와 추론된 HTMLButtonElement가 자바스크립트의 DOM 객체로 객체 타입이다. 
직접 객체 타입을 정의할 수도 있다. 이때 매개변수에 any 타입을 명시해도 작동하지만 객체가 value 속성을 가진다는 걸 분명히 하고자 한다. 또한 value 속성 값의 타입이 무엇인지 명시하기 위해 중괄호를 명시하고 객체의 구조를 작성한다. 여기서 새 객체를 생성하는 것이 아니다. 구조만 정의하는 것이다. 이때 하나 이상의 필드를 가질 수도 있다. 
    function printResult(resultObj: { val: number; timestamp: Date }) {
        console.log(resultObj.val);
    }
- Date 객체는 자바스크립트에 내장되어 생성자 함수를 참조해 타입으로 가질 수 있다.

이제 printResult 함수를 호출할 때 명시한 객체를 전달해야 한다.
    printResult({ val: result as number, timestamp: new Date() });
- 이때 타입스크립트는 result 상수가 반드시 number임을 이해하지 못하고 에러를 표시한다. 이론상으로 항상 숫자를 반환하는 return n1 + n2 부분을 추론할 수 있어야 한다. 항상 숫자임을 명시하기 위해 as number를 입력한다.

전역에 numResults, textResults라는 빈 배열을 추가한다. 그리고 numResults에 도달해 result를 푸시한다.
    const numResults: number[] = [];
    const textResults: string[] = [];
- 두 상수 모두 배열을 가지는 건 맞지만 배열 안에 저장된 값도 구체적으로 명시해야 한다. 타입스크립트로 상수의 유형을 지정할 수 있다. 이때 타입 뒤에 [] 기호를 추가하여 저장되는 데이터가 해당 타입으로 이루어진 배열이라는 것을 알린다.
    ...
    numResults.push(result as number);
    textResults.push(stringResult as string);
- 여기서도 에러가 발생한다. result는 유니온 타입이라 string이 될 수도 있다. 따라서 as로 타입을 명시한다.
    ...
    console.log(numResults, textResults);
- 이때 콘솔 로그에 벌써 에러가 발생하는데 numResults이 any[] 타입임이 암시된다는 게 에러의 원인이다. add 함수에는 허용하는 데이터 유형을 명시했지만 배열에 관해서는 하지 않았다.  
===========================================================================================
501_유형 별칭(Type alias) 및 인터페이스(Interface)

지금의 코드에 일부 반복이 존재한다. 예를 들어 number | string 처럼 같은 유니온 타입을 두 곳에 재사용하고 있다. 잘못된 코드는 아니지만 type alias 를 사용해 개선할 수 있다.
타입스크립트에는 자바스크립트에 없는 type 연산자가 내장되어 있다. typeof와는 다른 코드다. 이걸 사용하여 타입에 새로운 이름을 줄 수 있다. 유니언 타입을 다루는 경우 유용한데 여기선 NumOrString 이라는 타입으로 정의한다.
    type NumOrString = number | string;
    type Result = { val: number; timestamp: Date };
- 이제 number | string 유니언 타입을 사용하는 모든 곳을 NumOrString으로 대체한다.
- 또한 객체 타입을 저장할 때 사용할 수도 있다.

컴파일하면 type 부분이 사라지는데 순수한 타입스크립트의 기능이기 때문이다. 

객체 타입을 다룰 때 다른 대안은 인터페이스다. 이것도 객체의 구조를 정의할 수 있다. 
    interface ResultObj {
        val: number; 
        timestamp: Date;
    }   
위와 동일한 구조를 사용할 수 있는데 무슨 차이가 있을까? 단순히 객체의 구조를 정의하는 경우 어느쪽이든 사용해도 된다. 인터페이스를 자주 쓰지만 필수는 아니다. 그러나 인터페이스는 특정 메서드 내지는 기능을 구현하기 위해 클래스를 강제 지정하기 위해서도 사용할 수 있다. 이 강의의 범위를 넘어가므로 생략한다.

마지막으로 중요한 점은 직접 클래스나 생성자 함수를 추가할 경우 Date 처럼 클래스 이름을 타입으로 사용할 수 있다. Date는 new Date를 사용해 인스턴스화를 거쳐 현재 날짜 시간 스탬프를 가져올 수 있으나 단순히 타입으로 사용할 수도 있는데 이것은 내장되거나 직접 생성한 것에 관계없이 모든 생성자 함수와 클래스에 적용된다.
===========================================================================================
502_제네릭(Generic)

이미 코드에도 제네릭 타입이 있다. numResults, textResults이다. 제네릭 타입은 단순히 다른 타입과 상호작용하는 타입으로 배열이 아주 좋은 예시다. 배열은 그 자체로도 타입이다. 데이터의 목록이라는 게 핵심 타입이다. 그러나 배열 내부에 존재하는 데이터의 타입과도 상호작용한다. 즉, 배열은 외부 타입이라고 할 수 있고 배열 내부의 모든 요소는 내부 타입으로 볼 수 있다. 
여기에서 배열 타입을 정의하는 방식(number[], string[])은 타입스크립트의 단축어다. 더 긴 형태는 numResults를 Array 타입으로 설정하는데 이제는 배열이 소위 말하는 제네릭 타입이며 둘러싸인, 즉 내부 타입을 정의해야 하는데 이 경우 배열 내부의 값들이 가지는 값 타입을 정의해야 한다. 이건 <> 기호를 추가하고 사이에 배열의 제네릭 타입을 추가하며 여기선 number가 된다.
    const numResults: Array<number> = [];
이렇게 하면 numResults는 숫자로 채워진 배열이라는 걸 의미한다. 이 부등호 사이에 들어온 내용은 다루는 제네릭 타입에 따라 다른 의미를 가진다. 

또 다른 제네릭 타입의 예시로 프로미스가 있다. 
기본값으로 이 코드가 작동하지 않으므로 tsconfig 파일에 라이브러리를 추가하여 지원하고자 하는 기능이 어떤 타입인지 알려야 한다. target 옵션을 보면 기본값으로 타입스크립트를 es5 자바스크립트 코드로 컴파일하도록 구성되어 있는데 이건 상당히 오래되었다. es6 이상으로 변경하면 사용할 수 있다. 프로미스는 당연히 타입스크립트의 기능이 아니며, 구버전 자바스크립트에서 작동하도록 컴파일할 수 없다. 오류가 뜨지만 다른 유형의 오류이다. 
* 현재 target의 기본값은 es2016이다.
    const myPromise = new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            resolve('It worked!');
        }, 1000);    
    });
    myPromise.then((result) => {
        console.log(result.split('w'));
    });

이제 프로미스를 정의할 수 있다. 이 프로미스는 함수를 인수로 가진다. 이 함수도 자체적으로 인수 2개를 갖는데 resolve, reject 함수다. 프로미스 내부를 직접 정의하는 경우 타임아웃으로 1초 뒤에 코드가 실행되도록 할 수 있다. 1초 뒤에 프로미스가 'It worked!'라고 resolve 할 것이다.
그리고 프로미스를 사용해서 result를 수신하고 콘솔에 출력한다.

프로미스는 왜 제네릭 타입일까? 결과적으로 어느 값으로 리졸브하는데 이렇게 리졸브되는 값 또한 프로미스에 대한 제네릭 타입이기 때문이다. 배열의 경우에는 배열에 저장된 값이고, 프로미스에서는 프로미스가 리졸브하는 값이다. 여기선 string으로 리졸브되며 w에 대해 split을 호출할 수 있다. 
그러나 제네릭 타입을 명시하지 않으면 타입스크립트가 result의 타입을 모르기 때문에 에러가 발생한다. 따라서 프로미스 뒤에 <string>을 추가하여 프로미스가 리졸브될 타입을 정해준다.
모든 내장된 객체에 대해서 부등호를 설정할 수는 없다. 이걸 지원하는 객체만 가능하며 프로미스 객체, 프로미스 생성자 함수는 프로미스가 결과적으로 리졸브할 값을 설정할 수 있기에 제네릭 타입을 지원한다.

제네릭 타입은 조금 어렵지만 합리적이다. 더 복잡한 타입이나 단순히 함께 연결된 타입을 다룰 때 추가적인 타입 안전을 제공한다.
===========================================================================================
505_Node 및 TypeScript

이제 Node에서 타입스크립트를 사용해보자. tsc --init으로 구성파일을 생성하고 express, body-parser 등을 설치한다.
기존처럼 node 앱을 구축하면 이렇게 할 수 있다.
    const express = require('express');
    const app = express();
    app.listen(3000);
하지만 .ts 파일에서는 자동으로 require라는 이름을 찾을 수 없다는 에러가 뜬다. 이 에러를 고치는 방법이 제시되는데 이 require 메서드는 Node로 코드를 실행할 때만 사용할 수 있음을 이해하자. 브라우저에서 실행하려고 한다면 존재하지 않는다. 타입스크립트는 우리가 어디에서 이 코드를 실행할지 모르며 IDE에는 타입스크립트 지원이 내장되었기 때문에 타입스크립트가 존재 여부를 모른다는 걸 탐지한다. 따라서 타입스크립트에게 존재여부를 알리기 위해 패키지를 설치한다.
    npm install --save-dev @types/node
@types가 중요하다. npm에는 많은 @types 패키지가 있다. 이 패키지들은 자바스크립트 기능에 대한 타입스크립트 번역을 제공한다고 할 수 있다. 이들은 타입스크립트로 하여금 특정 라이브러리, 패키지, 명령어를 이해하게 하는 코드를 포함하며 @types/node를 설치하면 Node.js 특정 구문을 타입스크립트 파일에서 사용할 수 있게 된다. 이 디펜던시가 이 내용의 자바스크립트로의 번역을 타입스크립트에 제공하기 때문이다. 이 경우 require 함수가 존재하는 것만을 알린다 왜냐하면 Node 앱을 우리가 구축하는 중이기 때문이다.

또 하나의 문제는 app. 등 .을 추가해도 자동 완성이 작동하지 않는다. IDE가 app 객체에서 수신할 수 있다는 걸 모르기 때문이다. 코드는 작동하지만 불편할 것이다. 또한, 타입스크립트는 listen 메서드의 형태나 필요한 인수나 작동 방식을 모르기 때문에 잘못된 매개변수 전달을 수락한다. 따라서 런타임 에러가 발생할 수 있다.
타입스크립트로 하여금 전반적인 node 런타임 때처럼 Express 패키지를 인식하게 해야한다.
    npm install --save-dev @types/express

이외에도 주요 자바스크립트 라이브러리는 @types로 타입스크립트 번역본을 찾을 수 있다.
그러나 아직도 에러가 발생하지 않는다. Node의 경우에는 패키지 설치만으로 충분했지만 임포트하는 제3자 패키지는 부족하다. 임포트 구문이 문제다. 기본값으로 타입스크립트는 브라우저에서 실행되는 웹 앱에 맞춰져 있고 여기엔 require 임포트 구문을 사용할 수 없다. 즉, 다수의 파일을 합치는 과정에서 기본값으로 예상하는 임포트 구문이 아니다. 
이러한 타입스크립트의 예측은 config 파일에서 수정한다. moduleResolution 을 추가하고 node로 설정한다.
    "moduleResolution": "node"
그리고 임포트 구문을 변경한다.
    import express = require('express');
또는 이렇게 할 수도 있다.
    import express from 'express';
Node.js에서 일반적으로 지원하지 않는 구문이다. 클라이언트 측에서 알고 최종적으로 브라우저에서 알게 되는 임포트 구문이다. 클라이언트 측 코드에서 다른 파일로부터 이 파일로 임포트하는 방식이다. Node.js는 기본값으로 require를 사용한다. 타입스크립트는 이 import 구문을 활성화할 수 있고 수락한다. 
그러나 컴파일 해보면 그 결과인 js 파일에서는 여전히 require를 사용한다.
물론 최신 자바스크립트 기능에서 import from 구문이 타입스크립트 없이도 Node.js에 의해 지원된다는 걸 배웠었다. 다만 이 경우에는 package.json을 변경하지 않았다는 것이 차이점이다.

중요한 점은 타입스크립트에선 import from을 사용해야 하며 그 이후에도 node가 사용하는 require로 컴파일된다는 것이다. 즉, 우리가 작성하는 코드와 서버에서 실제로 실행되는 코드에 차이점이 존재한다.

이제 .을 입력하면 자동 완성이 동작한다.
===========================================================================================
506_Typescript Express

매우 단순한 to do 앱의 REST API를 구축해보자. routes 폴더를 만들고 그 안에 todos.ts를 만든다.
app.ts =>
    import todosRoutes from './routes/todos';
    import bodyParser from 'body-parser';
    ...
    app.use(bodyParser.json());
    
todos.ts =>
    import { Router } from 'express';
    const router = Router();
- express의 임포트를 약간 변경하여 필요한 것만 임포트할 수 있다.
    export default router;
- 이 파일에서 router를 기본값 엑스포트로 내보낸다. 임포트하는 파일에서 이름을 자유롭게 사용할 수 있다.
    let todos = [];

    router.get('/', (req, res, next) => {
        res.status(200).json({ todos: todos });
    });

todos에서 에러가 발생한다. 배열에 정확한 타입을 정의해야 하기 때문이다.
===========================================================================================
507_TypeScript로 REST 라우트 추가

todo는 최소한 객체이므로 interface를 사용할 수도 있다. 여기선 models 폴더를 생성하고 내부의 todo.ts 파일에서 인터페이스를 탐색하고 export 한다. 이 구문은 기본 ES 모듈의 구문이므로 최신 자바스크립트에서 지원한다. 
models/todo.ts =>
    export interface Todo {
        id: string;
        text: string;
    }
- 이것은 기본값 엑스포트가 아니므로 임포트하는 파일에선 이름을 정확히 써야한다.

routes/todos.ts =>
    import { Todo } from '../models/todo';
    let todos: Todo[] = [];
- 이제 todos가 배열 타입을 바탕으로 Todo로 가득 찬 배열이라는 걸 분명히 하였다.
    ...
    router.post('/todo', (req, res, next) => {
        const newTodo: Todo = {
            id: new Date().toISOString(),
            text: req.body.text,
        };
- 이때 newTodo 객체의 타입을 Todo로 명시해야 한다. 정의한 타입과 일치하지 않는 공백 객체 등을 허용하지 않는다. 이것이 타입스크립트의 핵심 개념이다.
- 들어오는 요청에 첨부된 모든 데이터를 바디에서 추출하기 위해 body-parser를 사용한다.
        todos.push(newTodo);

        res.status(201).json({ message: 'Added Todo', todo: newTodo, todos: todos });
    });

작업하는 라이브러이에 대응하는 types 패키지를 설치하는 것을 권장한다.
    npm install --save-dev @types/body-parser
추가적인 타입스크립트 안정성을 위함이며 사실 여기서 사용하는 용도로는 필요한 것은 아니다.
===========================================================================================
508_라우트 완료

/todo/:todoId 에 대한 put 라우트와 delete 라우트를 추가한다. 
todos.ts =>
    router.put('/todo/:todoId', (req, res, next) => {
        const tid = req.params.todoId;
        const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
- 파라미터로 받은 id를 이용하여 todos 배열에 있는 해당 todo의 인덱스를 찾는다.
        if (todoIndex >= 0) {
            todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
            return res.status(200).json({ message: 'Updated todo', todos: todos });
        }
- id는 기존의 것을 유지하고 텍스트만 변경한다.
        res.status(404).json({ message: 'Could not find todo for this id.' });
    });

    router.delete('/todo/:todoId', (req, res, next) => {
        todos = todos.filter((todoItem) => todoItem.id !== req.params.todoId);
        res.status(200).json({ message: 'Delete todo', todos: todos });
    });

기존에 배운 간단한 REST API를 이용한 CRUD 작업이다.
===========================================================================================
509_API 테스트

컴파일하면 models 폴더의 todo.js는 사실상 비어있는데 interface는 순수한 타입스크립트의 기능이므로 컴파일 과정 중 타입스크립트를 돕지만 자바스크립트 코드는 생성하지 않는다.
node app.js 로 서버를 실행하고 postman으로 테스트한다. localhost:3000/todo 등에 알맞은 HTTP 메서드와 데이터를 전송한다.
===========================================================================================
510_형 변환

req.body, req.params에 접근할 때 req 객체로 시작하는 한 자동 완성이 작동되었다. 이어지는 body는 자동완성 없이 유연하게 액세스 가능한데 타입스크립트가 들어오는 req.body 안에 무엇이 있는지 모르기 때문이다. req.params 도 마찬가지다. 타입스크립트는 body, params 등 중간의 객체 안에 무엇이 있는지 알기 위해 코드의 다른 부분을 분석하지 않는다. 
정리하자면 body는 any 타입이고, params는 ParamsDictionary 타입이다. ParamsDictionary은 키-값 쌍을 가진 객체로 모든 키가 허용되는 타입이다.
문제는 이때 타입스크립트의 이점을 완전히 활용하지 못한다는 것이다. req.body.testsss 등 뒤에 잘못된 필드를 입력해도 경고하지 못한다. 
타입스크립트가 들어오는 요청에서 어떤 유형의 데이터를 받을지 예상은 못하지만 개발자는 알기 때문에 타입스크립트에 알릴 수 있다. 또한 req.body가 어떻게 보여야 할지 알려주기 위해 코드를 조정한다.

    type RequestBody = { text: string };
    type RequestParams = { todoId: string };

    router.post('/todo', (req, res, next) => {
        const body = req.body as RequestBody;
- as 키워드로 특정 타입을 갖도록 타입스크립트에 알린다.
        const newTodo: Todo = {
            ...
            text: body.text,
- 이제 body 뒤에 잘못된 필드에 texts 등 잘못된 필드에 접근하면 에러가 발생한다.
        };
        ...
    });

    router.put('/todo/:todoId', (req, res, next) => {
        const params = req.params as RequestParams;
        const tid = params.todoId;
        const body = req.body as RequestBody;
        ...
    });

    router.delete('/todo/:todoId', (req, res, next) => {
        const params = req.params as RequestParams;
        ...
    });

지금은 어쩌다보니 같은 타입의 req.params를 다루고 있지만 여러 라우트에 같은 패턴으로 각기 다른 별칭을 붙일 수도 있다. 
===========================================================================================
511_더 나은 프로젝트 구조

기초적인 코드는 모두 작성하였다. 하지만 폴더 구조에 실수의 여지가 남아있다. 일단 routes 폴더는 있고 controllers 폴더는 없다. 물론 둘로 나누어 컨트롤러 관련 함수를 정리할 수 있지만 현재 한 파일에 전부 둔 이유는 적은 코드로 만든 더미 API이기 때문이다. 
타입스크립트를 사용하기 때문에 생긴 다른 문제점은 자바스크립트 파일이 항상 타입스크립트 파일 옆에 있다는 것이다. 개발자가 작업을 하는 소스 코드는 타입스크립트 코드뿐이라 이름이 같은 자바스크립트 파일이 옆에 있으면 혼동해서 잘못 작업할 가능성이 충분하다. 컴파일된 자바스크립트 코드는 건들지 않고 타입스크립트 코드만 작업하기 위해 컴파일 된 파일이 다른 곳에 생성되도록 해야한다.

tsconfig.json 파일에서 outDir의 주석을 풀고 생성된 자바스크립트 파일이 저장된 디렉터리를 설정할 수 있다. 예를 들어 ./dist 를 경로로 설정하면 dist라는 하위 폴더를 생성하고 컴파일 된 모든 파일이 해당 폴더에 생성된다. 이제 dist 폴더가 완성된 node 앱을 가지며 소스 코드는 밖에만 존재한다.
따로 소스 코드를 저장하는 소스 폴더를 만들어서 입력과 출력을 분명히 나눌 수도 있다. src 폴더를 만들고 models, routes, app.ts 파일을 src 폴더로 옮긴다. 다시 구성 파일로 가서 rootDir을 ./src 로 설정해서 타입스크립트 코드를 가진 폴더로 설정한다. 
즉, outDir은 컴파일된 코드가 존재하고 rootDir은 소스 코드가 존재하는 폴더다. 
이제 반드시 dist 폴더에 있는 코드를 실행해야 한다는 것을 기억하자. Node.js는 타입스크립트 코드를 실행할 수 없다.

package.json 파일에서 start 스크립트에 "node dist/app.js"를 추가하면 npm start 명령어를 입력하여 컴파일 된 자바스크립트 코드를 기반으로 서버를 가동할 수 있다.