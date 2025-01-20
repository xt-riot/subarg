var subarg = require('..');
var test = require('tape');

test('inline brackets', function (t) {
    t.plan(7);

    t.deepEqual(
        subarg('http://localhost\?q=\[1\]'.split(/\s+/)),
        {
            _: [ 'http://localhost?q=[1]' ]
        }
    )

    t.deepEqual(
        subarg('beep -t [ boop -o a.txt -u http://localhost -u http://localhost\?q=\[1\] -q]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: [ 'http://localhost', 'http://localhost?q=[1]' ],
                q: true
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [boop -o a.txt -u http://localhost -u http://localhost\?q=\[1\] -q -o b.txt]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: [ 'a.txt', 'b.txt' ],
                u: [ 'http://localhost', 'http://localhost?q=[1]' ],
                q: true
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [ boop -o a.txt -u http://localhost -u http://localhost\?q=\[1\] ]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: [ 'http://localhost', 'http://localhost?q=[1]' ]
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [boop -o a.txt -u http://localhost\?q=\[1\] -u http://localhost]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: [ 'http://localhost?q=[1]', 'http://localhost' ]
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [ boop -o a.txt -u [beep] ]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: {
                    _: [ 'beep' ]
                }
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [boop] -u [ be[ep] ]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ]
            },
            u: {
                _: [ 'be[ep]' ]
            }
        }
    )
});

test.skip('doesnt work', function (t) {
    t.plan(2);
    /*
     *  expected:
     *    { _: [ 'beep' ], t: { _: [ 'boop' ], o: 'a.txt', u: [ 'http://localhost', 'http://localhost?q=[1]' ] } }
     *  actual:
     *    { _: [ 'beep' ], t: true }
     *
    */
    t.deepEqual(
        subarg('beep -t [boop -o a.txt -u http://localhost -u http://localhost\?q=\[1\]]'.split(/\s+/)),
        {
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: [ 'http://localhost', 'http://localhost?q=[1]' ]
            }
        }
    )

    t.deepEqual(
        subarg('beep -t [ boop -o a.txt -u [ be[ep]] ]'.split(/\s+/)),
        {
            /* Same as above - note the context-closing bracket is right next to an inline closing bracket
             * If you add a space, it works
             *  expected:
             *    { _: [ 'beep' ], t: { _: [ 'boop' ], o: 'a.txt', u: { _: [ 'be[ep]' ] } } }
             *  actual:
             *    { _: [ 'beep' ], t: true }
            */
            _: [ 'beep'],
            t: {
                _: [ 'boop' ],
                o: 'a.txt',
                u: {
                    _: [ 'be[ep]' ]
                }
            }
        }
    )
});
