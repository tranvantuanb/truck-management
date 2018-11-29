import PropTypes from 'prop-types';

const propTypes = {
  items: PropTypes.array.isRequired,
  onPageChanged: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
  isSorted: PropTypes.bool
}

const defaultProps = {
  initialPage: 1,
  pageSize: 10
}

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentDidMount() {
    this.goToPage(this.props.initialPage);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.items !== prevProps.items) {
      this.goToPage(this.props.initialPage);
    }

    if (this.state.pager.totalItems && (this.state.pager.totalItems != prevProps.items.length)) {
      this.goToPage(this.props.initialPage);
    }

    if (this.props.isSorted != prevProps.isSorted) {
      this.goToPage(prevState.pager.currentPage);
    }
  }

  goToPage(page) {
    let { items, pageSize } = this.props;
    let pager = this.state.pager;

    if (page < 1 || page > pager.totalPages) {
        return;
    }

    pager = this.getPager(items.length, page, pageSize);

    let currentItems = items.slice(pager.startIndex, pager.endIndex + 1);

    this.setState({ pager: pager });
    this.props.onPageChanged(currentItems);
  }

  getPager(totalItems, currentPage, pageSize) {
    currentPage = currentPage || 1;
    pageSize = pageSize || 10;

    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;

    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  render() {
    let pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      return null;
    }

    return (
      <ul className="pagination">
        <li className={"page-item"} onClick={() => this.goToPage(1)}>
          <a className={`page-link ${pager.currentPage === 1 ? 'disabled' : ''}`}>First</a>
        </li>
        <li className={"page-item"} onClick={() => this.goToPage(pager.currentPage - 1)}>
          <a className={`page-link ${pager.currentPage === 1 ? 'disabled' : ''}`}>Previous</a>
        </li>
        {pager.pages.map((page, index) =>
          <li
            key={index}
            className={`page-item ${pager.currentPage === page ? 'active' : ''}`}
            onClick={() => this.goToPage(page)}
          >
            <a className="page-link">{page}</a>
          </li>
        )}
        <li className="page-item" onClick={() => this.goToPage(pager.currentPage + 1)}>
          <a className={`page-link ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>Next</a>
        </li>
        <li className="page-item" onClick={() => this.goToPage(pager.totalPages)}>
          <a className={`page-link ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>Last</a>
        </li>
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
