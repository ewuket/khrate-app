
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/lovable-uploads/206fd2ee-0377-47a0-8083-70118088988f.png"
                alt="KHRATE Logo"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Big Savings in Every Crate. Making grocery shopping affordable and accessible.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/bundles" className="text-muted-foreground hover:text-khrate-500">Bundles</Link></li>
              <li><Link to="/custom-buy" className="text-muted-foreground hover:text-khrate-500">Custom Buy</Link></li>
              <li><Link to="/group-buy" className="text-muted-foreground hover:text-khrate-500">Group Buy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-muted-foreground hover:text-khrate-500">My Profile</Link></li>
              <li><Link to="/orders" className="text-muted-foreground hover:text-khrate-500">My Orders</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-khrate-500">Saved Bundles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-khrate-500">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-khrate-500">Contact</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-khrate-500">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KHRATE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
