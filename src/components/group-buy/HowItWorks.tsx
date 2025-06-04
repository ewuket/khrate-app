
const HowItWorks = () => {
  return (
    <div className="bg-khrate-50 border border-khrate-100 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-2">How Group Buy Works</h2>
      <p className="text-muted-foreground mb-4">
        Create or join a group with friends to enjoy bulk buying discounts. Once a group reaches its minimum members, everyone gets the discount!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="p-4">
          <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
            <span className="font-bold text-khrate-700">1</span>
          </div>
          <p className="font-medium">Create or join a group</p>
        </div>
        <div className="p-4">
          <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
            <span className="font-bold text-khrate-700">2</span>
          </div>
          <p className="font-medium">Add items to group cart</p>
        </div>
        <div className="p-4">
          <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
            <span className="font-bold text-khrate-700">3</span>
          </div>
          <p className="font-medium">Reach minimum members</p>
        </div>
        <div className="p-4">
          <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
            <span className="font-bold text-khrate-700">4</span>
          </div>
          <p className="font-medium">Enjoy group discounts</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
