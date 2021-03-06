/**
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

import Agent from '../Agent'
import save from './save'

module.exports = (app, hosts) => {
  hosts.on = !hosts.on

  Agent.pact('getPref')
    .then(pref => {
      let list = app.state.list.slice(0)
      let is_single = pref.choice_mode === 'single'

      if (is_single && hosts.on) {
        list.map(item => {
          if (item.id !== hosts.id) {
            item.on = false
          }
        })
      }

      return list
    })
    .then(list => {
      let idx = list.findIndex(item => item.id === hosts.id)
      if (idx === -1) {
        list.push(Object.assign({}, hosts))
      } else {
        let old_hosts = list[idx]
        list.splice(idx, 1, Object.assign({}, old_hosts, hosts))
      }

      save(app, list, hosts)
    })

  Agent.pact('statRecord', 'switch')
}
