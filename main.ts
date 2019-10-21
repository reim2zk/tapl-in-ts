type TmVar = {
    type: 'var',
    name: string,
}
type TmAbs = {
    type: 'abs',
    x: TmVar,
    t: Term,
}
type TmApp = {
    type: 'app',
    t1: Term,
    t2: Term,
}
type Term = TmVar | TmAbs | TmApp

function is_value(t: Term): boolean {
    return t.type == 'abs'
}

function print_term(t: Term): string {
    switch (t.type) {
        case 'var':
            return t.name
        case 'abs': {
            const sx = print_term(t.x)
            const st = print_term(t.t)
            return `λ${sx} . ${st}`
        }            
        case 'app': {
            const s1 = print_term(t.t1)
            const s2 = print_term(t.t2)
            return `(${s1} ${s2})`
        }
    }
}

function refresh_var(t: Term, ctx: {[key: string]: string}): Term {
    switch(t.type) {
        case 'var': return vari(t.name in ctx ? ctx[t.name] + "\'" : t.name)
        case 'abs': {
            const name_new = name in ctx ? ctx[name] = name + "\'" : t.x.name
            ctx[name] = name_new
            return abs(ctx[name_new], refresh_var(t.t, ctx))
        }
        case 'app': return app(refresh_var(t.t1, ctx), refresh_var(t.t2, ctx))
    }
}


// [x|->s] t
function substitute(x: TmVar, s: Term, t: Term): Term | null {
    if(t.type=='var' && t == x) {
        return s
    } 
    if(t.type=='abs') {
        return null
    }
    return null
}

function eval_one(t: Term): Term | null {
    if(t.type=='app' && is_value(t.t1)) {
        const t2prime = eval_one(t.t2)
        if(t2prime != null)
            return app(t.t1, t2prime)
    }
    if(t.type=='app') {
        const t1prime = eval_one(t.t1)
        if(t1prime != null)
            return app(t1prime, t.t2)
    }
    if(t.type=='app' && t.t1.type=="abs" && is_value(t.t2)) {
        return substitute(t.t1.x, t.t1.t, t.t2)
    }
    return null
}

function eval_all(t: Term): Term {
    const tprime = eval_one(t)
    if(tprime == null) {
        return t
    } else {
        return eval_all(tprime)
    }
}

function vari(name0: string): TmVar {
    const t: TmVar = {type: 'var', name: name0} 
    return t
}
function abs(xname: string, t: Term): TmAbs {
    const x: TmVar = vari(xname)
    const t1: Term = {type: 'abs', x: x, t: t}
    return t1
}
function app(t1: Term, t2: Term): TmApp {
    const t: Term = {type: 'app', t1: t1, t2: t2}
    return t
}

const c1 = abs("s", abs("z", app(vari("s"), vari("z"))))
console.log(print_term(c1))
console.log("hello TS")