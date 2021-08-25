import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageContainerContent from '../../../components/ui/page-container/page-container-content.component';
import Dialog from '../../../components/ui/dialog';
import SendAmountRow from './send-amount-row';
import SendGasRow from './send-gas-row';
import SendHexDataRow from './send-hex-data-row';
import SendAssetRow from './send-asset-row';

export default class SendContent extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    updateGas: PropTypes.func,
    showAddToAddressBookModal: PropTypes.func,
    showHexData: PropTypes.bool,
    contact: PropTypes.object,
    isOwnedAccount: PropTypes.bool,
    warning: PropTypes.string,
    error: PropTypes.string,
    gasIsExcessive: PropTypes.bool.isRequired,
    gasPriceIsExtendMax: PropTypes.bool.isRequired,
    gasLimitIsExtendMax: PropTypes.bool.isRequired,
  };

  updateGas = (updateData) => this.props.updateGas(updateData);

  render() {
    const { warning, error, gasIsExcessive, gasPriceIsExtendMax, gasLimitIsExtendMax } = this.props;
    return error ? (
      this.renderError()
    ) : (
      <PageContainerContent>
        <div className="send-v2__form">
          {(gasIsExcessive || gasPriceIsExtendMax || gasLimitIsExtendMax) && this.renderError(gasIsExcessive, gasPriceIsExtendMax, gasLimitIsExtendMax)}
          {warning && this.renderWarning()}
          {/* {this.maybeRenderAddContact()} */}
          <SendAssetRow />
          <SendAmountRow updateGas={this.updateGas} />
          <SendGasRow />
          {this.props.showHexData && (
            <SendHexDataRow updateGas={this.updateGas} />
          )}
        </div>
      </PageContainerContent>
    );
  }

  maybeRenderAddContact() {
    const { t } = this.context;
    const {
      isOwnedAccount,
      showAddToAddressBookModal,
      contact = {},
    } = this.props;

    if (isOwnedAccount || contact.name) {
      return null;
    }

    return (
      <Dialog
        type="message"
        className="send__dialog"
        onClick={showAddToAddressBookModal}
      >
        {t('newAccountDetectedDialogMessage')}
      </Dialog>
    );
  }

  renderWarning() {
    const { t } = this.context;
    const { warning } = this.props;

    return (
      <Dialog type="warning" className="send__error-dialog">
        {t(warning)}
      </Dialog>
    );
  }

  renderError(gasIsExcessive, gasPriceIsExtendMax, gasLimitIsExtendMax) {
    const { t } = this.context;
    const { error } = this.props;
    let message;
    if (gasPriceIsExtendMax) {
      message = t('gasPriceExtendMax');
    } else if (gasLimitIsExtendMax) {
      message = t('gasLimitExtendMax');
    } else if (gasIsExcessive) {
      message = t('gasPriceExcessive');
    } else {
      message = t(error);
    }
    return (
      <Dialog type="error" className="send__error-dialog">
        {message}
      </Dialog>
    );
  }
}
