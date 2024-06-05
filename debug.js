

class Cat {
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.meow(this.value);
  }
  meow(X) {
    return X;
  }
}

var foo = new Cat(4);
console.log(+foo); // 4
