import bind from 'decorators/bind';
import isElementSelected from 'helpers/is-element-selected';
import Component from 'components/component';
import React, {PropTypes} from 'react';
import {selectElement, overElement, outElement} from 'actions/page-builder';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Element from './element';

@connect(
  (state, props) => {
    const {pageBuilder} = state;
    const building = state.router.location.query.build && true;
    const elem = {
      id: props.element.id,
      context: props.context
    };
    const selected = building && !props.disableSelection && isElementSelected(pageBuilder.selected, elem);
    const overed = building && !props.disableSelection && isElementSelected(pageBuilder.overed, elem);
    const focused = isElementSelected(pageBuilder.focused, elem);
    const linkingDataMode = pageBuilder.menuTab === 'link';

    return {
      overed,
      selected,
      display: state.display,
      dragging: state.dnd.dragging,
      building,
      focused,
      linkingDataMode
    };
  },
  (dispatch) => bindActionCreators({
    selectElement,
    overElement,
    outElement
  }, dispatch)
)
export default class ElementContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    element: PropTypes.object.isRequired,
    editing: PropTypes.bool.isRequired,
    overed: PropTypes.bool,
    selected: PropTypes.bool,
    building: PropTypes.bool,
    disableSelection: PropTypes.bool,
    linkingDataMode: PropTypes.bool
  };

  getInitState () {
    const {element} = this.props;
    return {
      animation: element.animation && element.animation.use,
      animated: false,
      animatedEditing: false
    };
  }

  componentWillReceiveProps () {
    const {editing, element} = this.props;
    if (editing && this.state.animation !== (element.animation && element.animation.use)) {
      this.setState({
        animation: element.animation && element.animation.use
      });
    }
  }

  @bind
  startAnimation () {
    this.setState({
      animated: true,
      animatedEditing: false
    });
  }

  @bind
  resetAnimation () {
    this.setState({
      animated: false,
      animatedEditing: true
    });
  }

  render () {
    const {disableSelection, focused} = this.props;
    return (
      <Element
        {...this.props}
        {...this.state}
        startAnimation={this.startAnimation}
        resetAnimation={this.resetAnimation}
        focused={focused}
        disableSelection={disableSelection}
      >
        {this.props.children}
      </Element>
    );
  }
}
