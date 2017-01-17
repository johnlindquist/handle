import { evolve, inc, concat, merge, path, curry, apply, bind, reduce, keys, prop, assoc } from 'ramda'
import { Component } from 'react'

const updateMessage = (state, event) => merge(state, { message: path(['target', 'value'])(event) })
const updateCount = (state, event) => evolve({ count: inc })(state)

function Handle(handleObject) {
    return function decorator(componentClass) {
        return class extends componentClass {
            handle = curry((fn, event) => {
                this.setState(fn(this.state, event))
            })

            render(){
                  return apply(bind(super.render, this), [
                      this.state, 
                      reduce((acc, key)=> assoc(key, this.handle(prop(key)(handleObject)), acc),{}, keys(handleObject))
                ])
            } 
        }
    }
}

@Handle({
    updateCount,
    updateMessage
})
class App extends Component {
    state = {
        message: "Hello",
        count: 0
    }

    render({message, count}, {updateCount, updateMessage}) {

        return (<div>
            <input onInput={updateMessage} />
            {message}
            <hr />
            <button onClick={updateCount}>Inc</button>
            {count}
        </div>)
    }

}

export default () => new App()