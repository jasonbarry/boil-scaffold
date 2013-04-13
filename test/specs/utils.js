describe('J', function () {
  describe('.Math', function () {
    describe('.randomIntWithinRange()', function() {
        
      it('should create a random number within a valid range', function() {
        var rand = J.Math.randomIntWithinRange(24, 32);

        rand.should.be.within(24, 32);
      });

      it('should be an integer', function() {
        var rand = J.Math.randomIntWithinRange(68, 157);
        var floor = Math.floor(rand);
        var difference = rand - floor;

        difference.should.equal(0);
      });
      
      it('should work with negative numbers', function() {
        var rand = J.Math.randomIntWithinRange(-100, -1);

        rand.should.be.within(-100, 1);
      });
    });
  });
});


describe('Number', function () {
  describe('.clamp()', function () { 

    it('should clamp a number between a range', function() {
      var num = 60;
      num.clamp(55, 65);

      num.should.equal(60);
    });
    
    it('should clamp lower bounds', function() {
      var num = 40;
      var result = num.clamp(55, 65);

      result.should.equal(55);
    });

    it('should clamp higher bounds', function() {
      var num = 80;
      var result = num.clamp(55, 65);

      result.should.equal(65);
    });
  });
});

