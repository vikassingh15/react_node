import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Col, ControlLabel, FormControl, FormGroup, Modal, ModalHeader, Row, Button } from 'react-bootstrap';
import axios from 'axios';

import accounting from 'accounting';

let initialState = {
  showAddProductModal: false,
  itemName: '',
  itemFeedback: null,
  formattedPrice: null,
  price: '',
  priceFeedback: null,
  items: [],
  message: null
};

export default class Products extends React.Component {


  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    axios.get('http://localhost:1337/items')
      .then(res => {
        const items = res.data;
        this.setState({ items });
      })
  }

  toggleProductPopup = () => {
    this.setState({
      showAddProductModal: !this.state.showAddProductModal,
    }, () => {
      if (!this.state.showAddProductModal) {
        this.setState({
          itemName: null,
          itemFeedback: null,
          price: null,
          formattedPrice: null,
          priceFeedback: null
        });
      }
    });

  }

  addNewItem = () => {
    const itemPrice = this.state.price && ( parseFloat(this.state.price) > 0);
    if (itemPrice && this.state.itemName) {
      const newItem = {
        id: this.state.items.length + 1,
        item: this.state.itemName,
        price: this.state.price
      };

      const items = this.state.items;
      items.push(newItem);

      this.setState({
        items
      });

      axios.post('http://localhost:1337/items', newItem)
        .then(res => {
          if (res.status == 200) {
            this.handleMessage('Item added sucessfully!');
          } else if (res.message) {
            this.handleMessage(res.message);
          } else {
            this.handleMessage('Something went wrong!');
          }
        })

      this.toggleProductPopup();
    } else {
      this.setState({
        itemFeedback: !this.state.itemName,
        priceFeedback: !this.state.priceFeedback
      })
    }
  }

  handleMessage = (message) => {
    this.setState({
      message: message,
    });

    setTimeout(() => this.setState({
      message: null
    }), 1500);
  }

  itemNameHandler = (e) => {
    const name = e.target.value;
    if (!name) {
      this.setState({
        itemFeedback: true,
      });
    } else {
      this.setState({
        itemName: name && name.trim(),
        itemFeedback: false,
      });
    }

  }

  priceHandler = (e) => {
    const price = e.target.value;
    if (!price) {
      this.setState({
        priceFeedback: true,
      });
    } else {
      this.setState({
        price,
        priceFeedback: false
      });
    }
  }

  onChangeItemPriceHandler = (e) => {
    const price = e.target.value;
    this.formatPrice(price);
  }

  onBlurItemPriceHandler = (e) => {
    const price = e.target.value;
    this.formatPrice(price, 'blur');
  }

  formatNumber = (n) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  formatPrice = (value, blur) => {
    var input_val = value;
    if (input_val === "") { return; }
    var original_len = input_val.length;
    if (input_val.indexOf(".") >= 0) {
      var decimal_pos = input_val.indexOf(".");

      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      left_side = this.formatNumber(left_side);
      right_side = this.formatNumber(right_side);

      if (blur === "blur") {
        right_side += "00";
      }

      right_side = right_side.substring(0, 2);
      input_val = "$" + left_side + "." + right_side;

    } else {
      input_val = this.formatNumber(input_val);
      input_val = "$" + input_val;

      if (blur === "blur") {
        input_val += ".00";
      }
    }

    let price = input_val.replace(',', '');
    price = price.replace('$', '');

    this.setState({
      formattedPrice: input_val,
      price
    })
  }


  render() {
    const footerData = [
      [
        {
          label: 'Total',
          columnIndex: 0
        },
        {
          label: 'Total value',
          columnIndex: 2,
          align: 'right',
          formatter: (tableData) => {
            let totalSum = 0;
            for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
              totalSum += parseFloat(tableData[i].price);
            }
            return (moneyFormatter(totalSum));
          }
        }
      ]
    ];

    function moneyFormatter(cell) {
      if (cell) {
        return (<span className="float-right">{accounting.formatMoney(cell)}</span>);
      }
      return '$ 0.00';
    }

    function rowStyleFormat(row, rowIdx) {
      return { backgroundColor: rowIdx % 2 === 0 ? 'white' : '#D3D3D3' };
    }

    return (
      <div>
        {this.state.message && <div className="message"> {this.state.message} </div>}
        <Modal
          show={!!this.state.showAddProductModal}
          centered
          onHide={this.toggleProductPopup}
          id={'addProduct'}>
          <Modal.Header>Add Item</Modal.Header>
          <Modal.Body>
            {
              <div>
                <FormGroup>
                  <FormControl
                    type="text"
                    name="itemName"
                    id="itemName"
                    placeholder="Item Name"
                    onBlur={this.itemNameHandler}
                  />
                  {this.state.itemFeedback && !this.state.itemName &&
                    <small className="help-block">Item name is required. </small>}
                </FormGroup>

                <input
                  type="text"
                  name="currency-field"
                  id="currency-field"
                  className="form-control"
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  value={this.state.formattedPrice}
                  data-type="currency"
                  placeholder="Item price e.g. $1,000,000.00"
                  onChange={this.onChangeItemPriceHandler}
                  onBlur={this.onBlurItemPriceHandler}
                />
                {this.state.priceFeedback && ( !this.state.price || this.state.price <=0) &&
                  <small className="help-block">Item price should be more than 0. </small>}
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            {<div>
              <Button
                className="btn btn-danger"
                onClick={() => {
                  this.toggleProductPopup();
                }}
              >CANCLE</Button>
              <Button
                className="btn btn-success ml-2"
                onClick={() => {
                  this.addNewItem();
                }}
              >SUBMIT</Button>
            </div>}
          </Modal.Footer>
        </Modal>

        <BootstrapTable
          data={this.state.items}
          footerData={footerData}
          footer
          pagination
          search
          trStyle={rowStyleFormat}
        >
          <TableHeaderColumn dataField='id' isKey={true}
            tdStyle={{ textAlign: 'left', width: '20%' }}
            thStyle={{ textAlign: 'center', width: '20%' }}
          >Sr No.</TableHeaderColumn>
          <TableHeaderColumn dataField='item'
            tdStyle={{ textAlign: 'left', width: '40%' }}
            thStyle={{ textAlign: 'center', width: '40%' }}
          >Item Name</TableHeaderColumn>
          <TableHeaderColumn dataField='price'
            dataFormat={moneyFormatter}
            tdStyle={{ textAlign: 'center', width: '40%' }}
            thStyle={{ textAlign: 'center', width: '40%' }}>
            Item Price</TableHeaderColumn>
        </BootstrapTable>

        <div className="row">
          <div className="col-md-12">
            <Button
              onClick={this.toggleProductPopup}
              className="block"
            >Add New Item</Button>

          </div>
        </div>

      </div >
    );
  }
}