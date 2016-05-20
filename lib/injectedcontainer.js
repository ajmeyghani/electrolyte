// Load modules.
var path = require('canonical-path')
  , ExposedSpec = require('./exposedspec');


/**
 * Container wrapper used when injected into a factory.
 *
 * When a "factory" requires that the container itself be injected, the
 * container is first wrapped.  This wrapper provides an interface that can be
 * used by the factory to introspect its environment, which is useful when
 * loading plugins, among other functionality.  The wrapper also restricts
 * inadvertent use of other functionality in the wrapped container.
 *
 * Note that requiring an injected container makes the requiring object
 * dependent on the IoC runtime's existence.  The need to couple the object to
 * the runtime should be carefully considered, and avoided if an alternative
 * approach is possible.
 *
 * @constructor
 * @api private
 */
function InjectedContainer(c, ns) {
  this._c = c;
  this._ns = ns || '';
}

InjectedContainer.prototype.create = function(id) {
  // TODO: Prevent '..' from being used here, by resovling path and making sure in ns
  // TODO: Preserve parent here.
  // TODO: handle relative paths, pass parent id in
  
  var aid = path.join(this._ns, id);
  return this._c.create(aid);
}

InjectedContainer.prototype.specs = function() {
  // Filter the exposed specs to only those that exist within the namespace
  // of the object being created.
  var specs = this._c.specs()
    , exposed = []
    , spec, rid, i, len;
  for (i = 0, len = specs.length; i < len; ++i) {
    spec = specs[i];
    rid = path.relative(this._ns, spec.id);
    if (rid.indexOf('../') == 0) { continue; }
    exposed.push(new ExposedSpec(rid, spec));
  }
  return exposed;
}


module.exports = InjectedContainer;