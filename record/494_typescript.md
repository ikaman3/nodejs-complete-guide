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

