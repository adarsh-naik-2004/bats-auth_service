export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100)
}

// here now adding this dollar would potentially break the codebase if not checked
// thats why tests are important
